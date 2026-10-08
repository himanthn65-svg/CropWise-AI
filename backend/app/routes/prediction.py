from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.ml.predictor import predictor
from app.models.recommendation import Recommendation
from app.models.user import User
from app.schemas.recommendation import (
    AlternativeCrop,
    PredictionRequest,
    PredictionResponse,
)


router = APIRouter(
    prefix="/predict",
    tags=["Crop Prediction"]
)


@router.post(
    "",
    response_model=PredictionResponse
)
def predict_crop(
    data: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prediction = predictor.predict(
        {
            "N": data.N,
            "P": data.P,
            "K": data.K,
            "temperature": data.temperature,
            "humidity": data.humidity,
            "ph": data.ph,
            "rainfall": data.rainfall,
        }
    )

    recommendation = Recommendation(
        user_id=current_user.id,
        nitrogen=data.N,
        phosphorus=data.P,
        potassium=data.K,
        temperature=data.temperature,
        humidity=data.humidity,
        ph=data.ph,
        rainfall=data.rainfall,
        recommended_crop=prediction["recommended_crop"],
        confidence=prediction["confidence"],
    )

    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)

    alternatives = [
        AlternativeCrop(**item)
        for item in prediction["alternatives"]
        if item["confidence"] > 0
    ]

    return PredictionResponse(
        recommended_crop=prediction["recommended_crop"],
        confidence=prediction["confidence"],
        alternatives=alternatives,
        recommendation_id=recommendation.id,
    )