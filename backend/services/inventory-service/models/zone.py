from sqlalchemy import Column, Integer, String
from db.database import Base
class Zone(Base):
      __tablename__ = "zone"
      id = Column(Integer, primary_key=True, index=True)
      warehouse_code = Column(String)
      zone_code = Column(String)
      zone_name = Column(String)