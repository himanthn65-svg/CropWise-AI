from app.database.database import Base, engine
from app.models import User, FarmerProfile, Recommendation


print("Creating CropWise AI database tables...")

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")