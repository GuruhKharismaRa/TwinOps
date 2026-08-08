from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from db.database import Base
import uuid

class UserRole(Base):
      __tablename__ = "user_roles"
      id = Column(Integer, primary_key=True, index=True)
      user_id = Column(String)
      role_id = Column(String)
