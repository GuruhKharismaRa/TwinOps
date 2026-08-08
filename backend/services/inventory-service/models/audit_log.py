from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from db.database import Base
import uuid

class AuditLog(Base):
      __tablename__ = "audit_log"
      id = Column(Integer, primary_key=True, index=True)
      audit_id =  Column(String, default=lambda: str(uuid.uuid4()), unique=True)
      # Event information
      event_type = Column(String) 
      module = Column(String)
      action = Column(String)
      severity = Column(String, default="INFO")
      # Entity information
      entity_type = Column(String)
      entity_id = Column(String)
      entity_code = Column(String)
      # User information
      performed_by = Column(String)
      user_role = Column(String)
      tenant_id = Column(String)
      # Request information
      request_id = Column(String)
      trace_id = Column(String)
      session_id = Column(String)
      # Network information
      ip_address = Column(String)
      user_agent = Column(String)
      device_info = Column(String)
      # Value changes
      old_value = Column(String, default="")
      new_value = Column(String, default="")
      remarks = Column(String, default="")
      #  Status
      status = Column(String)
      # Timestamp
      created_at = Column(DateTime, default=datetime.utcnow)