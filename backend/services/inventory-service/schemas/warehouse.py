from pydantic import BaseModel

class WarehouseRequest(BaseModel):
    warehouse_code: str
    warehouse_name: str
    location: str