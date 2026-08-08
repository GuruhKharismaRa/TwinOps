from sqlalchemy import Column, Integer, String
from db.database import Base
class Bin(Base):
      __tablename__ = "bin"
      id = Column(Integer, primary_key=True, index=True)
      warehouse_code = Column(String)
      zone_code = Column(String)
      rack_code = Column(String)
      bin_code = Column(String)