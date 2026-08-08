from fastapi import APIRouter

from sqlalchemy.orm import Session

from db.database import SessionLocal

from models.forklift import Forklift

from event.producer import publish_event

router = APIRouter(
    prefix="/forklift",
    tags=["Forklift"]
)

from schemas.forklift import (
    RegisterForkliftRequest,
      MoveForkliftRequest    )
# =====================================================
# REGISTER FORKLIFT
# =====================================================

@router.post("/register")
def register_forklift(data: RegisterForkliftRequest):

    db: Session = SessionLocal()

    forklift = Forklift(

        forklift_code=
            data.forklift_code,

        operator_name=
            data.operator_name,

        warehouse_id=
            data.warehouse_id,

        current_zone=
            data.current_zone,

        current_rack=
            data.current_rack,

        x_position=
            data.x_position,

        y_position=
            data.y_position,

        status=
            "IDLE"
    )

    db.add(forklift)

    db.commit()

    return {
        "status":"registered"
    }

# =====================================================
# UPDATE POSITION
# =====================================================

@router.post("/move")
def move_forklift(data: MoveForkliftRequest):

    db: Session = SessionLocal()

    forklift = db.query(
        Forklift
    ).filter(

        Forklift.forklift_code ==
            data.forklift_code

    ).first()

    if not forklift:

        return {
            "error":"Forklift not found"
        }

    forklift.current_zone = data.current_zone

    forklift.current_rack =data.current_rack

    forklift.x_position = data.x_position

    forklift.y_position = data.y_position

    forklift.status = data.status

    db.commit()

    publish_event(
        "forklift.position.updated",
        {

            "event_type":
                "forklift.position.updated",

            "forklift_code":
                forklift.forklift_code,

            "operator_name":
                forklift.operator_name,

            "warehouse_id":
                forklift.warehouse_id,

            "current_zone":
                forklift.current_zone,

            "current_rack":
                forklift.current_rack,

            "x_position":
                forklift.x_position,

            "y_position":
                forklift.y_position,

            "status":
                forklift.status
        }
    )

    return {
        "status":"updated"
    }

# =====================================================
# LIST FORKLIFT
# =====================================================

@router.get("/list")
def list_forklift():

    db: Session = SessionLocal()

    forklifts = db.query(
        Forklift
    ).all()

    result = []

    for forklift in forklifts:

        result.append({

            "forklift_code":
                forklift.forklift_code,

            "operator_name":
                forklift.operator_name,

            "warehouse_id":
                forklift.warehouse_id,

            "current_zone":
                forklift.current_zone,

            "current_rack":
                forklift.current_rack,

            "x_position":
                forklift.x_position,

            "y_position":
                forklift.y_position,

            "status":
                forklift.status
        })

    return result