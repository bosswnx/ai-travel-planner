from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import TripPlan, User
from backend.schemas import PlanCreate, PlanResponse
from backend.services.ai_service import AIService
from backend.dependencies import get_current_user
import json

router = APIRouter(
    prefix="/plans",
    tags=["plans"]
)

@router.post("/generate", response_model=PlanResponse)
def generate_plan(plan: PlanCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Call AI
    ai_result = AIService.generate_itinerary(plan.user_input)
    
    if "error" in ai_result:
        raise HTTPException(status_code=500, detail=ai_result["error"])

    # 2. Save to DB
    db_plan = TripPlan(
        title=ai_result.get("title", "New Trip"),
        destination=plan.user_input[:20], # Simple truncation for destination
        start_date="TBD",
        days=len(ai_result.get("itinerary", [])),
        budget=ai_result.get("total_budget_estimate", "N/A"),
        content=json.dumps(ai_result), # Store as string
        user_id=current_user.id
    )
    
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    
    # 3. Return formatted response
    return PlanResponse(
        id=db_plan.id,
        title=db_plan.title,
        content=ai_result,
        created_at=db_plan.created_at.isoformat()
    )

@router.get("/", response_model=list[PlanResponse])
def get_my_plans(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    plans = db.query(TripPlan).filter(TripPlan.user_id == current_user.id).all()
    # Parse JSON content back to dict for response
    results = []
    for p in plans:
        try:
            content_dict = json.loads(p.content)
        except:
            content_dict = {}
            
        results.append(PlanResponse(
            id=p.id,
            title=p.title,
            content=content_dict,
            created_at=p.created_at.isoformat()
        ))
    return results

@router.delete("/{plan_id}")
def delete_plan(plan_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan = db.query(TripPlan).filter(TripPlan.id == plan_id, TripPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    db.delete(plan)
    db.commit()
    return {"message": "Plan deleted successfully"}