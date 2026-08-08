from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from db.database import SessionLocal

from models.notification_event import (NotificationEvent)
from services.notifications.notification_engine import ( NotificationEngine )
from auth.current_user import get_current_user

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

@router.get("")
def get_notifications(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rows = (
        db.query(
            NotificationEvent
        ).filter(
            NotificationEvent.recipient_id == current_user["user_id"]
        )
        .order_by(
            NotificationEvent.id.desc()
        )
        .limit(20)
        .all()
)
    
    unread_count = len([r for r in rows if r.status == "UNREAD"])
    
    return {
        "status":"success",
        "count": len(rows),
        "unread_count": unread_count,
        "data":[
            {
                "id": r.id,
                "title": r.title,
                "message": r.message,
                "status": r.status,
                "created_at": r.created_at.isoformat()
                if r.created_at else None,
                "url": r.url
            }
            for r in rows
        ]
    }
    
@router.post("/{id}/read")
def mark_read(
    id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    notification = (
        db.query(NotificationEvent)
        .filter(
            NotificationEvent.id == id
        )
        .first()
    )
    
    if not notification:
        return {
            "status": "error",
            "message": f"Notification ID: {id} not found"
        }

    notification.status = "READ"

    db.commit()

    return {
        "status":"success"
    }
    
