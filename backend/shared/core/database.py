from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from shared.core.config import settings
from db.database import SessionLocal

engine = create_engine(settings.DB_URL, pool_size=20, max_overflow=10)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

