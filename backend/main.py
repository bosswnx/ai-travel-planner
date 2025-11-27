import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend import models, database
from backend.routers import plans

# Load environment variables
load_dotenv()

# Create Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="AI Travel Planner API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plans.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Travel Planner API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
