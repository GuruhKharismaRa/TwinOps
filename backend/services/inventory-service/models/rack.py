from sqlalchemy import Column, Integer, String
from db.database import Base
class Rack(Base):
      __tablename__ = "rack"
      id = Column(Integer, primary_key=True, index=True)
      warehouse_code = Column(String)
      zone_code = Column(String)
      rack_code = Column(String)
      capacity = Column(Integer)