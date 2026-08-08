from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from db.database import Base
import uuid

class Permission(Base):
      __tablename__ = "permissions"
      id = Column(Integer, primary_key=True, index=True)
      permission_id = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
      permission_name = Column(String, unique=True)
      description = Column(String)
