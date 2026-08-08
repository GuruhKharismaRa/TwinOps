from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from db.database import Base
import uuid

class Access(Base):
      __tablename__ = "access"
      id = Column(Integer, primary_key=True, index=True)
      user_id = Column(String)
      warehouse_id = Column(String)
