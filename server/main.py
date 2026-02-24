from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import requests
import json
from . import models, schemas, database, auth
from .database import engine
from dotenv import load_dotenv

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MedVision AI API")

# CORS setup
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://medivision-ai-ten.vercel.app",  # Production frontend
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url and frontend_url not in origins:
    origins.append(frontend_url)

print(f"Allowed Origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
get_db = database.get_db

# --- Authentication ---
@app.post("/auth/firebase", response_model=schemas.User)
def firebase_auth_endpoint(
    req: schemas.FirebaseTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Verifies Firebase ID token and returns the user.
    If the user doesn't exist, they are created automatically.
    """
    try:
        # We manually verify here because this is the 'login' step
        decoded = auth.verify_firebase_token(req.id_token)
        email = decoded.get("email")
        name = decoded.get("name", email)
        firebase_uid = decoded.get("uid")

        user = db.query(models.User).filter(models.User.firebase_uid == firebase_uid).first()
        if not user:
            user = db.query(models.User).filter(models.User.email == email).first()
        
        if not user:
            user = models.User(
                email=email,
                name=name or email,
                firebase_uid=firebase_uid,
                hashed_password=None
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        elif not user.firebase_uid:
            user.firebase_uid = firebase_uid
            db.commit()
            db.refresh(user)
            
        return user
    except Exception as e:
        print(f"Firebase Auth Error: {e}")
        raise HTTPException(status_code=401, detail=str(e))

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- Reports ---
# n8n Webhook URL — handles OCR and AI analysis via Google Gemini Vision
N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "https://n8n-tj96.onrender.com/webhook/ocr-process")


@app.post("/reports/upload", response_model=schemas.Report)
def upload_report(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a medical report. Forwards to n8n which runs OCR and AI analysis
    via Google Gemini Vision, then returns structured health data.
    """
    # 1. Save file locally
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_location = f"{upload_dir}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Prepare payload for n8n
    extracted_data = "{}"
    ai_explanation = "Processed via n8n"
    risks = "[]"
    diet_plan = "[]"
    exercise_plan = "[]"

    try:
        with open(file_location, "rb") as f:
            # n8n webhook usually expects multipart/form-data
            files = {
                "file": (file.filename, f, file.content_type)
            }
            data = {
                "user_id": str(current_user.id)
            }
            # Note: Ensure your n8n webhook node is set to POST and 'Webhooks' trigger
            print(f"Calling n8n Webhook: {N8N_WEBHOOK_URL}")
            response = requests.post(N8N_WEBHOOK_URL, files=files, data=data, timeout=60)

        if response.status_code == 200:
            if not response.text.strip():
                print("n8n returned an empty response.")
                ai_explanation = "Integration error: n8n returned an empty response. This usually means the workflow failed to reach a response node."
                extracted_data = "{}"
            else:
                try:
                    result = response.json()
                    if result.get("status") == "success":
                        structured = result.get("structured_data", {})
                        extracted_data = json.dumps(structured)
                        raw_text = result.get("raw_text", "")
                        
                        # Extract recommendations from n8n
                        risks_list = result.get("risks", [])
                        diet_list = result.get("diet_plan", [])
                        exercise_list = result.get("exercise_plan", [])
                        
                        # Convert to JSON strings for database storage
                        risks = json.dumps(risks_list)
                        diet_plan = json.dumps(diet_list)
                        exercise_plan = json.dumps(exercise_list)
                        
                        # Use raw_text as AI explanation if available
                        ai_explanation = raw_text if raw_text else "Processed via n8n"
                    elif result:
                        ai_explanation = f"n8n logic error: {result.get('message', 'Unknown error')}"
                except json.JSONDecodeError:
                    print(f"n8n Response is not JSON: {response.text}")
                    ai_explanation = f"Integration error: Invalid JSON response from n8n. Raw: {response.text[:100]}"
                    extracted_data = "{}"
        else:
            ai_explanation = f"n8n connection failed: Status {response.status_code} - {response.text[:100]}"

    except Exception as e:
        print(f"Error calling n8n: {e}")
        ai_explanation = f"Integration error: {str(e)}"

    # 3. Save to DB
    new_report = models.Report(
        user_id=current_user.id,
        filename=file.filename,
        extracted_data=extracted_data,
        ai_explanation=ai_explanation,
        risks=risks,       # n8n workflow in this v1 doesn't generate this yet
        diet_plan=diet_plan,
        exercise_plan=exercise_plan
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@app.get("/reports/history", response_model=List[schemas.Report])
def get_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Report).filter(models.Report.user_id == current_user.id).order_by(models.Report.created_at.desc()).all()

@app.get("/")
def read_root():
    return {"message": "MedVision AI Backend Running"}
