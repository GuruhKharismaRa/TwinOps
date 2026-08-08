from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from db.database import Base
import uuid

class User(Base):
      __tablename__ = "users"
      id = Column(Integer, primary_key=True, index=True)
      user_id = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
      username = Column(String, unique=True)
      password_hash = Column(String)
      full_name = Column(String)
      email = Column(String, unique=True)
      is_active = Column(Boolean, default=True)
      created_at = Column(DateTime, default=datetime.utcnow)
      updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
      avatar_url = Column(String(500))
      phone = Column(String(50))