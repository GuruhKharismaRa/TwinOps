from pydantic import BaseModel

class InboundRequest(BaseModel):
    warehouse_id: str
    product_id: str
    quantity: int
    lot_number: str
    expiry_date: str