from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from db.database import Base
import uuid

class WarehouseTask(Base):
    __tablename__ = "warehouse_task"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String, default=lambda: str(uuid.uuid4()), unique=True)
    task_code = Column(String, unique=True)
    task_type = Column(String)
    warehouse_id = Column(String)
    source_rack = Column(String)
    source_bin = Column(String)
    target_rack = Column(String)
    target_bin = Column(String)
    product_id = Column(String)
    quantity = Column(Integer)
    priority = Column(String)
    status = Column(String)
    assigned_to = Column(String)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)