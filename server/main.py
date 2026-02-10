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

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MedVision AI API")

# CORS setup
origins = ["*"]

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
@app.post("/auth/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    # Note: reusing UserCreate for simplicity, though OAuth2PasswordRequestForm is standard
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- Reports ---
# Placeholder for Colab URL - in prod, store in env or db
# COLAB_API_URL = os.getenv("COLAB_API_URL", "https://unsportful-joyously-charise.ngrok-free.dev")
# Placeholder for Colab URL - in prod, store in env or db
# COLAB_API_URL = os.getenv("COLAB_API_URL", "https://unsportful-joyously-charise.ngrok-free.dev")
COLAB_API_URL = "https://unsportful-joyously-charise.ngrok-free.dev"
# Placeholder for n8n Webhook URL
N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "https://n8n-tj96.onrender.com/webhook/ocr-process")

@app.post("/reports/upload", response_model=schemas.Report)
def upload_report(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Save file locally
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_location = f"{upload_dir}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Send to Colab for Analysis
    try:
        # Re-open file to send
        with open(file_location, "rb") as f:
            files = {"file": (file.filename, f, file.content_type)}
            headers = {"ngrok-skip-browser-warning": "true"}
            response = requests.post(f"https://unsportful-joyously-charise.ngrok-free.dev/analyze-report", files=files, headers=headers, timeout=30)
        
        if response.status_code == 200:
            analysis_result = response.json()
            extracted_data = json.dumps(analysis_result.get("extracted_data", {}))
            ai_explanation = analysis_result.get("explanation", "")
            risks = json.dumps(analysis_result.get("risks", []))
            diet_plan = json.dumps(analysis_result.get("diet", []))
            exercise_plan = json.dumps(analysis_result.get("exercise", []))
        else:
            # Fallback/Error handling
            extracted_data = "{}"
            ai_explanation = "Analysis failed or service unavailable."
            risks = "[]"
            diet_plan = "[]"
            exercise_plan = "[]"

    except Exception as e:
        print(f"Error connecting to ML service: {e}")
        extracted_data = "{}"
        ai_explanation = "ML Service unreachable."
        risks = "[]"
        diet_plan = "[]"
        exercise_plan = "[]"

    # Create Report Entry
    new_report = models.Report(
        user_id=current_user.id,
        filename=file.filename,
        extracted_data=extracted_data,
        ai_explanation=ai_explanation,
        risks=risks,
        diet_plan=diet_plan,
        exercise_plan=exercise_plan
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@app.put("/users/profile", response_model=schemas.User)
def update_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.age is not None:
        current_user.age = user_update.age
    if user_update.gender is not None:
        current_user.gender = user_update.gender
    if user_update.weight is not None:
        current_user.weight = user_update.weight
    if user_update.health_history is not None:
        current_user.health_history = user_update.health_history
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.post("/process-with-n8n", response_model=schemas.Report)
def process_report_n8n(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Process report using n8n workflow for OCR and structured data extraction.
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
                "user_id": str(current_user.id),
                "user_name": current_user.name,
                "user_age": str(current_user.age or "N/A"),
                "user_gender": current_user.gender or "N/A",
                "user_weight": str(current_user.weight or "N/A"),
                "user_history": current_user.health_history or "N/A"
            }
            # Note: Ensure your n8n webhook node is set to POST and 'Webhooks' trigger
            response = requests.post(N8N_WEBHOOK_URL, files=files, data=data, timeout=60)

        if response.status_code == 200:
            try:
                result = response.json()
            except json.JSONDecodeError:
                print(f"n8n Response is not JSON: {response.text}")
                ai_explanation = f"Integration error: Invalid JSON response from n8n. Raw: {response.text[:100]}"
                extracted_data = "{}"
                result = {} 

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
