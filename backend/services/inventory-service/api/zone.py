from fastapi import APIRouter
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.zone import Zone
from schemas.zone import ZoneRequest


router = APIRouter(prefix="/zone", tags=["Zone"])

# Base.metadata.create_all(bind=engine)

@router.post("/create")
def create_zone(data: ZoneRequest):
    db: Session = SessionLocal()

    zone = Zone(
        warehouse_code=data.warehouse_code,
        zone_code=data.zone_code,
        zone_name=data.zone_name
    )
    db.add(zone)

    db.commit()

    return {
        "status":"zone created"
    }
