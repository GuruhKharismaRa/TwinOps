from pydantic import BaseModel

class RackRequest(BaseModel):
    warehouse_code: str
    zone_code: str
    rack_code: str
    capacity: int