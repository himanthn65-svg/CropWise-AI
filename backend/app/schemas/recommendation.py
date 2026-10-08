from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    N: float = Field(ge=0)
    P: float = Field(ge=0)
    K: float = Field(ge=0)
    temperature: float
    humidity: float = Field(ge=0, le=100)
    ph: float = Field(ge=0, le=14)
    rainfall: float = Field(ge=0)


class AlternativeCrop(BaseModel):
    crop: str
    confidence: float


class PredictionResponse(BaseModel):
    recommended_crop: str
    confidence: float
    alternatives: List[AlternativeCrop]
    recommendation_id: int


class HistoryItem(BaseModel):
    id: int
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    recommended_crop: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True