from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.warehouse_task import WarehouseTask
from event.producer import publish_event
from datetime import datetime
from schemas.warehouse_task import (
    CreateTaskRequest,
    AssignTaskRequest,
    CompleteTaskRequest
)
from services.audit_service import (
    create_audit_log
)
from auth.current_user import get_current_user
from services.notifications.notification_engine import ( NotificationEngine )
router = APIRouter(
    prefix="/task",
    tags=["Warehouse Task"], 
    dependencies=[Depends(get_current_user)]
)
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
# START TASK
@router.post("/start")
def start_task(
    data: CompleteTaskRequest,
    db: Session = Depends(get_db)
):

    # db: Session = SessionLocal()

    task = db.query(
        WarehouseTask
    ).filter(
        WarehouseTask.task_code == data.task_code
    ).first()

    if not task:
        return {
            "error":"Task not found"
        }

    if task.status != "ASSIGNED":
        return {
            "error":
                "Task must be ASSIGNED to start"
        }

    task.status = "IN_PROGRESS"

    db.commit()

    publish_event(
        "warehouse.task.started",
        {
            "event_type":
                "warehouse.task.started",
            "task_code":
                task.task_code,
            "status":
                task.status
        }
    )
    
    create_audit_log(
        db=db,
        event_type="warehouse.task.started",
        module="TASK",
        action="START",
        entity_type="WAREHOUSE_TASK",
        entity_id=task.task_id,
        entity_code=task.task_code
    )

    return {
        "status":"started"
    }
    
# CREATE TASK
@router.post("/create")
def create_task(
    data: CreateTaskRequest,
    request: Request,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # db: Session = SessionLocal()
    # Check if task with same code exists and is not deleted
    existing_task = db.query(
        WarehouseTask
    ).filter(
        WarehouseTask.task_code == data.task_code, 
        WarehouseTask.is_deleted == False
    ).first()
    if existing_task:
        return {
            "error":"Task with this code already exists"
        }
        
    # Create new task
    task = WarehouseTask(
        task_code=data.task_code,
        task_type=data.task_type,
        warehouse_id=data.warehouse_id,
        source_rack=data.source_rack,
        source_bin=data.source_bin,
        target_rack=data.target_rack,
        target_bin=data.target_bin,
        product_id=data.product_id,
        quantity=data.quantity,
        priority=data.priority,
        status="WAITING",
        assigned_to="UNASSIGNED"
    )

    db.add(task)
    db.commit()
    
    create_audit_log(
        db=db,
        event_type="warehouse.task.created",
        module="TASK",
        action="CREATE",
        entity_type="WAREHOUSE_TASK",
        entity_id=task.task_id,
        entity_code=task.task_code,
        performed_by= current_user["username"],
        request_id=request.state.request_id,
        trace_id=request.state.trace_id,
        session_id=request.state.session_id,
        ip_address=request.state.ip_address,
        user_agent=request.state.user_agent,
        new_value=f'''
        {{
            "task_code":"{task.task_code}",
            "status":"WAITING"
        }}
        ''',

        remarks="Task created"
    )

    publish_event(
        "warehouse.task.created",
        {
            "event_type":
                "warehouse.task.created",
            "task_code":
                task.task_code,
            "task_type":
                task.task_type,
            "warehouse_id":
                task.warehouse_id,
            "status":
                task.status
        }
    )

    return {
        "status":"created"
    }

# LIST TASKS
@router.get("/list")
def list_tasks(
    db: Session = Depends(get_db)
):

    # db: Session = SessionLocal()

    tasks = db.query(
        WarehouseTask
    ).all()

    result = []

    for task in tasks:
        result.append({
            "task_code":
                task.task_code,
            "task_type":
                task.task_type,
            "warehouse_id":
                task.warehouse_id,
            "source_rack":
                task.source_rack,
            "target_rack":
                task.target_rack,
            "product_id":
                task.product_id,
            "quantity":
                task.quantity,
            "priority":
                task.priority,
            "status":
                task.status,
            "assigned_to":
                task.assigned_to
        })

    return result

# ASSIGN TASK
@router.post("/assign")
def assign_task(
    data: AssignTaskRequest,
    request: Request,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # db: Session = SessionLocal()

    task = db.query(
        WarehouseTask
    ).filter(
        WarehouseTask.task_code == data.task_code
    ).first()

    if not task:
        return {
            "error":"Task not found"
        }
        
    old_operator = task.assigned_to
    if ( task.status == 'ASSIGNED' and old_operator == data.operator_id ):
        return {
            "error": "Task already assigned to this operator"
        }
    
    if task.status == "IN_PROGRESS":
        return {
            "error": "Task already in progress"
        }
    
    if task.status == 'COMPLETED':
        return {
            "error": "Task already completed"
        }

    task.assigned_to = data.operator_id 
    task.status = "ASSIGNED"

    db.commit()
    db.refresh(task)
    if old_operator != data.operator_id:
        NotificationEngine.notify_template(
            db=db,
            template_name= "task_assigned",
            recipient_id= data.operator_id,
            context={
                "task_no": task.task_code,
                # "operator":task.assigned_to
            }
        )
    publish_event(
        "warehouse.task.assigned",
        {
            "event_type":
                "warehouse.task.assigned",
            "task_code":
                task.task_code,
            "operator":
                task.assigned_to,
            "status":
                task.status
        }
    )
    
    action = (
        "REASSIGN"
        if old_operator != "UNASSIGNED"
        else "ASSIGN"
    )
    create_audit_log(
        db=db,
        event_type="warehouse.task.assigned",
        module="TASK",
        action=action,
        entity_type="WAREHOUSE_TASK",
        entity_id=task.task_id,
        entity_code=task.task_code,
        performed_by=current_user["username"],
        remarks=f"Assigned to {data.operator_id}"
    )

    return {
        "status":"assigned"
    }

# COMPLETE TASK

@router.post("/complete")
def complete_task(
    data: CompleteTaskRequest, 
    db: Session = Depends(get_db)
):

    # db: Session = SessionLocal()

    task = db.query(
        WarehouseTask
    ).filter(

        WarehouseTask.task_code == data.task_code

    ).first()

    if not task:
        return {
            "error":"Task not found"
        }
        
    if task.status != "IN_PROGRESS":

        return {
            "error":"Task must be IN_PROGRESS to complete"
        }
    task.status = "COMPLETED"

    task.completed_at = datetime.utcnow()

    db.commit()

    publish_event(
        "warehouse.task.completed",
        {
            "event_type":
                "warehouse.task.completed",
            "task_code":
                task.task_code,
            "status":
                task.status
        }
    )
    
    create_audit_log(
        db=db,
        event_type="warehouse.task.completed",
        module="TASK",
        action="COMPLETE",
        entity_type="WAREHOUSE_TASK",
        entity_id=task.task_id,
        entity_code=task.task_code
    )

    return {
        "status":"completed"
    }