from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )

    # =========================
    # Personal Information
    # =========================

    full_name = Column(
        String(150),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=True
    )

    bio = Column(
        Text,
        nullable=True
    )

    profile_photo = Column(
        Text,
        nullable=True
    )

    # =========================
    # Location Information
    # =========================

    state = Column(
        String(100),
        nullable=True
    )

    district = Column(
        String(100),
        nullable=True
    )

    village = Column(
        String(100),
        nullable=True
    )

    # =========================
    # Farm Information
    # =========================

    farm_size = Column(
        Float,
        nullable=True
    )

    soil_type = Column(
        String(100),
        nullable=True
    )

    irrigation = Column(
        String(100),
        nullable=True
    )

    # =========================
    # Farming Information
    # =========================

    farmer_type = Column(
        String(100),
        nullable=True
    )

    farming_experience = Column(
        String(100),
        nullable=True
    )

    primary_crops = Column(
        Text,
        nullable=True
    )

    preferred_season = Column(
        String(100),
        nullable=True
    )

    farming_goal = Column(
        String(150),
        nullable=True
    )

    # =========================
    # Timestamps
    # =========================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # =========================
    # Relationship
    # =========================

    user = relationship(
        "User",
        backref="farmer_profile"
    )