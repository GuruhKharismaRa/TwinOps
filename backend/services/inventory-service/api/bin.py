from fastapi import APIRouter
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.bin import Bin
from schemas.bin import BinRequest


router = APIRouter(prefix="/bin", tags=["Bin"])

# Base.metadata.create_all(bind=engine)

@router.post("/create")
def create_bin(data: BinRequest):
    db: Session = SessionLocal()

    bin = Bin(
        warehouse_code=data.warehouse_code,
        zone_code=data.zone_code,
        rack_code=data.rack_code,
        bin_code=data.bin_code
    )
    db.add(bin)

    db.commit()

    return {
        "status":"bin created"
    }
