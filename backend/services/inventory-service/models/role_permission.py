from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from db.database import Base
import uuid

class RolePermission(Base):
      __tablename__ = "role_permissions"
      id = Column(Integer, primary_key=True, index=True)
      role_id = Column(String)
      permission_id = Column(String)
