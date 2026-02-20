from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ReportBase(BaseModel):
    filename: str

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: int
    user_id: int
    extracted_data: Optional[str]
    ai_explanation: Optional[str]
    risks: Optional[str]
    diet_plan: Optional[str]
    exercise_plan: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
