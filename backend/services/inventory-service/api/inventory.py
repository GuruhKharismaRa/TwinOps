from fastapi import APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.database import SessionLocal
from models.inventory import Inventory
from models.warehouse import Warehouse  
from models.rack import Rack
from schemas.inventory import InboundRequest
from schemas.outbound import OutboundRequest
from services.assignment_service import assign_location

from event.producer import publish_event
from datetime import datetime

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.get("/summary")
def get_inventory_summary(warehouse_id: str):
    db: Session = SessionLocal()

    warehouses = db.query(Warehouse).all()
    result = []

    for warehouse in warehouses:
        # Logic for fetching inventory summary for each warehouse
        racks = db.query(Rack).filter(Rack.warehouse_code == warehouse.warehouse_code).all()    
        total_capacity = 0
        total_used = 0
        for rack in racks:
            total_capacity += rack.capacity
            used = db.query(func.sum(Inventory.quantity)).filter(Inventory.rack_code == rack.rack_code).scalar()
            if used:
                total_used += used

            if not used:
                used = 0
            
            total_used += used
        
        occupancy_percent = 0
        if total_capacity > 0:
            occupancy_percent = (total_used / total_capacity) * 100

        result.append({
            "warehouse_code": warehouse.warehouse_code,
            "warehouse_name": warehouse.warehouse_name,
            "location": warehouse.location,
            "capacity": total_capacity,
            "used": total_used,
            "occupancy_percent": round(occupancy_percent, 2)
        })

    return result

@router.post("/inbound")
def inbound(data: InboundRequest):

    db: Session = SessionLocal()

    location = assign_location(
        db, 
        data.warehouse_id,
        "ZONE-FMCG", 
        data.quantity
    )

    if not location:
        return {
            "error": "No location available"
        }
    
    # Simpan data inventory ke database
    
    inventory = Inventory(
        tenant_id="TENANT-01",
        warehouse_id=data.warehouse_id,
        zone_id="ZONE-FMCG",
        product_id=data.product_id,
        rack_code=location["rack_code"],
        bin_code=location["bin_code"],
        quantity=data.quantity,
        lot_number=data.lot_number,
        expiry_date=data.expiry_date
    )

    db.add(inventory)
    db.commit()

    # Inventory update event
    publish_event(
        "inventory.updated",
        {
            "event_type": "inventory.updated",
            "tenant_id":"TENANT-01",
            "warehouse_id": data.warehouse_id,
            "source":"inventory-service",
            "timestamp":datetime.utcnow().isoformat(),
            "payload": {
                "product_id": data.product_id,
                "quantity": data.quantity,
                "rack_code": location["rack_code"],
                "bin_code": location["bin_code"]
            }
        }
    )

    # Hitung occupancy rack setelah penambahan inventory
    rack = db.query(Rack).filter(Rack.rack_code == location["rack_code"]).first()

    used = db.query(
        func.sum(Inventory.quantity)
    ).filter(Inventory.rack_code == location["rack_code"]).scalar()

    if not used:
        used = 0
    
    occupancy_percent = (used / rack.capacity) * 100

    # occupancy update event
    publish_event(
        "rack.occupancy.updated",
        {
            "event_type": "rack.occupancy.updated",
            "warehouse_code": data.warehouse_id,
            "rack_code": location["rack_code"],
            "used": used,
            "capacity": rack.capacity,
            "occupancy_percent": round(occupancy_percent, 2)
        }
    )

    return {
        "status": "stored",
        "warehouse": data.warehouse_id,
        "rack": location["rack_code"],
        "bin": location["bin_code"],
        "occupancy_percent": round(occupancy_percent, 2)
    }

@router.post("/outbound")
def outbound(data: OutboundRequest):

    db: Session = SessionLocal()

    inventories = db.query(
        Inventory
    ).filter(

        Inventory.warehouse_id ==
            data.warehouse_id,

        Inventory.product_id ==
            data.product_id

    ).order_by(
        Inventory.expiry_date.asc()
    ).all()

    remaining = data.quantity

    picked_items = []

    for item in inventories:

        # STOP IF REQUEST FULFILLED

        if remaining <= 0:
            break

        available = item.quantity

        # SKIP EMPTY

        if available <= 0:
            continue

        take_qty = min(
            available,
            remaining
        )

        # REDUCE INVENTORY

        item.quantity -= take_qty

        # VERY IMPORTANT

        remaining -= take_qty

        picked_items.append({

            "rack_code":
                item.rack_code,

            "bin_code":
                item.bin_code,

            "lot_number":
                item.lot_number,

            "expiry_date":
                str(item.expiry_date),

            "picked_quantity":
                take_qty
        })

        # DELETE EMPTY INVENTORY

        if item.quantity <= 0:

            db.delete(item)

    db.commit()

    publish_event(
        "inventory.outbound",
        {
            "event_type":
                "inventory.outbound",

            "warehouse_id":
                data.warehouse_id,

            "product_id":
                data.product_id,

            "picked_items":
                picked_items
        }
    )

    return {

        "status":"picked",

        "product_id":
            data.product_id,

        "picked_items":
            picked_items,

        "remaining_request":
            remaining
    }