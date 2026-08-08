from pydantic import BaseModel
from typing import Optional


class CreateTaskRequest(BaseModel):

    task_code: str

    task_type: str

    warehouse_id: str

    source_rack: Optional[str] = None

    source_bin: Optional[str] = None

    target_rack: Optional[str] = None

    target_bin: Optional[str] = None

    product_id: Optional[str] = None

    quantity: int = 0

    priority: str = "MEDIUM"


class AssignTaskRequest(BaseModel):

    task_code: str

    operator_id: str


class CompleteTaskRequest(BaseModel):
    task_code: str