import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from . import database, models
import os
import json

# ── Firebase Admin SDK init ─────────────────────────────────────
_firebase_initialized = False

def _init_firebase():
    global _firebase_initialized
    if _firebase_initialized or firebase_admin._apps:
        return
    
    try:
        service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")
        if service_account_json:
            # Render: store the full JSON as an env var
            service_account_info = json.loads(service_account_json)
            cred = credentials.Certificate(service_account_info)
        else:
            # Local dev: point to the downloaded JSON file
            service_account_path = os.getenv(
                "FIREBASE_SERVICE_ACCOUNT_PATH",
                "server/firebase-service-account.json"
            )
            if not os.path.exists(service_account_path):
                print(f"ERROR: Firebase Service Account file not found at {service_account_path}")
                print("If you are on Render, please set the FIREBASE_SERVICE_ACCOUNT environment variable.")
                return

            cred = credentials.Certificate(service_account_path)
        
        firebase_admin.initialize_app(cred)
        _firebase_initialized = True
        print("Firebase Admin SDK initialized successfully.")
    except Exception as e:
        print(f"FAILED to initialize Firebase Admin SDK: {e}")

_init_firebase()

# ── Token verification ──────────────────────────────────────────
security = HTTPBearer()

def verify_firebase_token(id_token: str) -> dict:
    """Verify a Firebase ID token and return its decoded claims."""
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(database.get_db)
) -> models.User:
    """
    Dependency: verifies Firebase ID token from Authorization header,
    then looks up (or creates) the user in our DB.
    """
    id_token = credentials.credentials
    decoded = verify_firebase_token(id_token)

    email = decoded.get("email")
    name = decoded.get("name", email)
    firebase_uid = decoded.get("uid")

    if not email:
        raise HTTPException(status_code=400, detail="Firebase token missing email claim")

    user = db.query(models.User).filter(models.User.firebase_uid == firebase_uid).first()
    if not user:
        # Try by email as fallback
        user = db.query(models.User).filter(models.User.email == email).first()
    
    if not user:
        # First-time login: create the user
        user = models.User(
            email=email,
            name=name or email,
            firebase_uid=firebase_uid,
            hashed_password=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.firebase_uid:
        # Existing email/password user — link their Firebase UID
        user.firebase_uid = firebase_uid
        db.commit()

    return user
