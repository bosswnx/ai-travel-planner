from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class PlanBase(BaseModel):
    user_input: str # The raw text from voice/text input

class PlanCreate(PlanBase):
    pass

class PlanResponse(BaseModel):
    id: int
    title: str
    content: Dict[str, Any] # The JSON from AI
    created_at: str
    
    class Config:
        orm_mode = True
