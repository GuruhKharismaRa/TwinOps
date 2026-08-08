from pydantic import BaseModel

class ZoneRequest(BaseModel):
    warehouse_code: str
    zone_code: str
    zone_name: str