from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy import JSON
from datetime import datetime
from db.database import Base

class SearchIndex(Base):
      __tablename__ = "search_index"
      id = Column(Integer, primary_key=True, index=True)
      tenant_id = Column(String)
      entity_type = Column(String)
      entity_id = Column(String)
      entity_code = Column(String)
      entity_name = Column(String)
      search_text = Column(String)
      warehouse_id = Column(String)
      url = Column(String)
      is_active = Column(Boolean, default=True)
      created_at = Column(DateTime, default=datetime.utcnow)
      updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
      