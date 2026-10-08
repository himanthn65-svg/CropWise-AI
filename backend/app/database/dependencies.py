from .database import SessionLocal


def get_db():
    """
    Create a database session for a request
    and close it after the request finishes.
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()