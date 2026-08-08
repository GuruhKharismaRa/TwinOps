from pydantic import BaseModel

class RegisterForkliftRequest(BaseModel):
    forklift_code: str
    operator_name: str
    warehouse_id: str
    current_zone: str
    current_rack: str
    x_position: int
    y_position: int
    
    
class MoveForkliftRequest(BaseModel):
    forklift_code: str
    current_zone: str
    current_rack: str
    x_position: int
    y_position: int
    status: str
 