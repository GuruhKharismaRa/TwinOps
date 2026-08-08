from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from db.database import Base
import uuid

class Role(Base):
      __tablename__ = "roles"
      id = Column(Integer, primary_key=True, index=True)
      role_id = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
      role_name = Column(String, unique=True)
      description = Column(String)
