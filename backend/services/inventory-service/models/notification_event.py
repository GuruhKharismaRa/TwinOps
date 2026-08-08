from sqlalchemy import DateTime

from sqlalchemy import *

from db.database import Base

class NotificationEvent(Base):

    __tablename__ = "notification_events"

    id = Column(
        Integer,
        primary_key=True
    )

    event_code = Column(
        String(100)
    )

    recipient_id = Column(
        String(50)
    )

    title = Column(
        String(255)
    )

    message = Column(
        Text
    )

    payload = Column(
        JSON
    )
    
    severity = Column(
        String(20)
    )


    status = Column(
        String(50)
    )
    created_at = Column(
        DateTime)
    
    # NEW
    url = Column(String(255))