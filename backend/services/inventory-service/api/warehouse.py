from fastapi import APIRouter
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.warehouse import Warehouse
from schemas.warehouse import WarehouseRequest


router = APIRouter(prefix="/warehouse", tags=["Warehouse"])

# Base.metadata.create_all(bind=engine)

@router.post("/create")
def create_warehouse(data: WarehouseRequest):
    db: Session = SessionLocal()

    warehouse = Warehouse(
        warehouse_code=data.warehouse_code,
        warehouse_name=data.warehouse_name,
        location=data.location
    )
    db.add(warehouse)

    db.commit()

    return {
        "status":"warehouse created"
    }
