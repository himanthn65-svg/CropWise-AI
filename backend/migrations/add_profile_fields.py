from sqlalchemy import text

from app.database.database import engine


def migrate():
    columns = {
        "bio": "TEXT",
        "profile_photo": "TEXT",
        "farmer_type": "VARCHAR(100)",
        "farming_experience": "VARCHAR(100)",
        "primary_crops": "TEXT",
        "preferred_season": "VARCHAR(100)",
        "farming_goal": "VARCHAR(150)",
    }

    with engine.begin() as connection:
        for column_name, column_type in columns.items():
            connection.execute(
                text(
                    f"""
                    ALTER TABLE farmer_profiles
                    ADD COLUMN IF NOT EXISTS {column_name} {column_type}
                    """
                )
            )

    print("Profile fields added successfully.")


if __name__ == "__main__":
    migrate()