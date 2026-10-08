from fastapi import Depends, FastAPI
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.routes.auth import router as auth_router
from app.routes.profile import router as profile_router
from app.routes.prediction import router as prediction_router
from app.routes.history import router as history_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CropWise AI API",
    description="Smart Crop Recommendation System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(prediction_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {
        "message": "CropWise AI API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/auth/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at
    }