from pydantic import BaseModel

class OutboundRequest(BaseModel):
    warehouse_id: str
    product_id: str
    quantity: int
 