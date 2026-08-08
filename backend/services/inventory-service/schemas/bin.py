from pydantic import BaseModel

class BinRequest(BaseModel):
    warehouse_code: str
    zone_code: str
    rack_code: str
    bin_code: str