from sqlalchemy import Column, Integer, String
from db.database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(String)
    warehouse_id = Column(String)
    zone_id  = Column(String)
    product_id = Column(String)
    rack_code = Column(String)
    bin_code = Column(String)
    quantity = Column(Integer)
    lot_number = Column(String)
    expiry_date = Column(String)