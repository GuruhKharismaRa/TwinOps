from sqlalchemy import Column, Integer, String
from db.database import Base
class Forklift(Base):
      __tablename__ = "forklift"
      id = Column(Integer, primary_key=True, index=True)
      forklift_code = Column(String)
      operator_name = Column(String)
      warehouse_id = Column(String)
      current_zone = Column(String)
      current_rack = Column(String)
      x_position = Column(Integer)
      y_position = Column(Integer)
      status = Column(String)