from sqlalchemy.orm import Session
from sqlalchemy import func
from models.inventory import Inventory
from models.rack import Rack

from models.bin import Bin

def assign_location(
    db: Session,
    warehouse_code: str,
    zone_code: str,
    quantity: int
):

      racks = db.query(Rack).filter(
            Rack.warehouse_code == warehouse_code,
            Rack.zone_code == zone_code
      ).all()

      best_rack = None
      best_rack_occupancy = 999999

      for rack in racks:

            used = db.query(func.sum(Inventory.quantity)).filter(Inventory.warehouse_id == warehouse_code,
                    Inventory.zone_id == zone_code,
                    Inventory.rack_code == rack.rack_code).scalar()

            if not used:
                  used = 0
            available = rack.capacity - used
            # check space
            if available < quantity:
                  continue

            occupancy = used / rack.capacity

            #find lowest occupancy
            if occupancy < best_rack_occupancy:
                  best_rack = rack
                  best_rack_occupancy = occupancy     

      if not best_rack:
            return None
      
      # Find Bin in the best rack
      bin_data = db.query(Bin).filter(
            Bin.warehouse_code == warehouse_code,
            Bin.zone_code == zone_code,
            Bin.rack_code == rack.rack_code
      ).first()

      if not bin_data:
            return None

      return {
            "rack_code": best_rack.rack_code,
            "bin_code": bin_data.bin_code
      }