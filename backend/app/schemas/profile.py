from typing import Optional

from pydantic import BaseModel, Field


class ProfileCreateUpdate(BaseModel):
    # Personal information
    full_name: str = Field(
        min_length=2,
        max_length=150
    )

    phone: Optional[str] = Field(
        default=None,
        max_length=20
    )

    bio: Optional[str] = Field(
        default=None,
        max_length=1000
    )

    profile_photo: Optional[str] = Field(
        default=None
    )

    # Location
    state: Optional[str] = Field(
        default=None,
        max_length=100
    )

    district: Optional[str] = Field(
        default=None,
        max_length=100
    )

    village: Optional[str] = Field(
        default=None,
        max_length=100
    )

    # Farm information
    farm_size: Optional[float] = Field(
        default=None,
        gt=0
    )

    soil_type: Optional[str] = Field(
        default=None,
        max_length=100
    )

    irrigation: Optional[str] = Field(
        default=None,
        max_length=100
    )

    # Farming information
    farmer_type: Optional[str] = Field(
        default=None,
        max_length=100
    )

    farming_experience: Optional[str] = Field(
        default=None,
        max_length=100
    )

    primary_crops: Optional[str] = Field(
        default=None,
        max_length=1000
    )

    preferred_season: Optional[str] = Field(
        default=None,
        max_length=100
    )

    farming_goal: Optional[str] = Field(
        default=None,
        max_length=150
    )


class ProfileResponse(ProfileCreateUpdate):
    id: int
    user_id: int

    class Config:
        from_attributes = True