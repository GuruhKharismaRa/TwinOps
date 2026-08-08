from sqlalchemy import Column, Integer, String
from db.database import Base

class Warehouse(Base):
      __tablename__ = "warehouse"
      id = Column(Integer, primary_key=True, index=True)
      warehouse_code = Column(String)
      warehouse_name = Column(String)
      location       = Column(String)