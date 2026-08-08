from fastapi import APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.database import SessionLocal
from models.inventory import Inventory
from models.rack import Rack
from schemas.rack import RackRequest


router = APIRouter(prefix="/rack", tags=["Rack"])

# Base.metadata.create_all(bind=engine)

@router.post("/create")
def create_rack(data: RackRequest):
    db: Session = SessionLocal()

    rack = Rack(
        warehouse_code=data.warehouse_code,
        zone_code=data.zone_code,
        rack_code=data.rack_code,
        capacity=data.capacity
    )
    db.add(rack)

    db.commit()

    return {
        "status":"Rack created"
    }
@router.get("/occupancy")
def rack_occupancy():
    db: Session = SessionLocal()

    racks = db.query(Rack).all()

    result = []

    for rack in racks:

        used = db.query(
            func.sum(Inventory.quantity)
        ).filter(Inventory.warehouse_id == rack.warehouse_code,
            Inventory.zone_id == rack.zone_code,
            Inventory.rack_code == rack.rack_code
        ).scalar()

        if not used:
            used = 0

        occupancy_percent = (used / rack.capacity) * 100

        result.append({
            "warehouse_code":rack.warehouse_code,
            "zone_code":rack.zone_code,
            "rack_code":rack.rack_code,
            "capacity":rack.capacity,
            "used":used,
            "occupancy_percent":round(occupancy_percent, 2)
        })

    return result