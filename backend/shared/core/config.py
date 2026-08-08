import os
from dotenv import load_dotenv

load_dotenv()

class Settings:

    DB_URL = os.getenv("DB_URL")

    KAFKA_BROKER = os.getenv("KAFKA_BROKER")

    REDIS_URL = os.getenv("REDIS_URL")

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "findTheOnePiece"
    )

    ALGORITHM = os.getenv(
        "ALGORITHM",
        "HS256"
    )

    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv(
            "ACCESS_TOKEN_EXPIRE_MINUTES",
            "480"
        )
    )

settings = Settings()