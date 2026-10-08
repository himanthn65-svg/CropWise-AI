from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.models.farmer_profile import FarmerProfile
from app.models.user import User
from app.schemas.profile import ProfileCreateUpdate, ProfileResponse


router = APIRouter(
    prefix="/profile",
    tags=["Farmer Profile"]
)


@router.get(
    "",
    response_model=ProfileResponse
)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(FarmerProfile)
        .filter(FarmerProfile.user_id == current_user.id)
        .first()
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )

    return profile


@router.post(
    "",
    response_model=ProfileResponse,
    status_code=status.HTTP_201_CREATED
)
def create_profile(
    data: ProfileCreateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_profile = (
        db.query(FarmerProfile)
        .filter(FarmerProfile.user_id == current_user.id)
        .first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Farmer profile already exists"
        )

    profile = FarmerProfile(
        user_id=current_user.id,

        # Personal information
        full_name=data.full_name,
        phone=data.phone,
        bio=data.bio,
        profile_photo=data.profile_photo,

        # Location
        state=data.state,
        district=data.district,
        village=data.village,

        # Farm information
        farm_size=data.farm_size,
        soil_type=data.soil_type,
        irrigation=data.irrigation,

        # Farming information
        farmer_type=data.farmer_type,
        farming_experience=data.farming_experience,
        primary_crops=data.primary_crops,
        preferred_season=data.preferred_season,
        farming_goal=data.farming_goal
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


@router.put(
    "",
    response_model=ProfileResponse
)
def update_profile(
    data: ProfileCreateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(FarmerProfile)
        .filter(FarmerProfile.user_id == current_user.id)
        .first()
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )

    # Personal information
    profile.full_name = data.full_name
    profile.phone = data.phone
    profile.bio = data.bio
    profile.profile_photo = data.profile_photo

    # Location
    profile.state = data.state
    profile.district = data.district
    profile.village = data.village

    # Farm information
    profile.farm_size = data.farm_size
    profile.soil_type = data.soil_type
    profile.irrigation = data.irrigation

    # Farming information
    profile.farmer_type = data.farmer_type
    profile.farming_experience = data.farming_experience
    profile.primary_crops = data.primary_crops
    profile.preferred_season = data.preferred_season
    profile.farming_goal = data.farming_goal

    db.commit()
    db.refresh(profile)

    return profile