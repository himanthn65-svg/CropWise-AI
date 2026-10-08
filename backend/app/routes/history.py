from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.models.recommendation import Recommendation
from app.models.user import User
from app.schemas.recommendation import HistoryItem


router = APIRouter(
    prefix="/history",
    tags=["Recommendation History"]
)


@router.get(
    "",
    response_model=List[HistoryItem]
)
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recommendations = (
        db.query(Recommendation)
        .filter(
            Recommendation.user_id == current_user.id
        )
        .order_by(
            Recommendation.created_at.desc()
        )
        .all()
    )

    return recommendations