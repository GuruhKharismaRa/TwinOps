from models.notification_event import ( NotificationEvent)
from datetime import datetime
from event.producer import publish_event

class InAppProvider:

    def send(
        self,
        db,
        notification
    ):

        row = (
            NotificationEvent(
                event_code=notification.get("type"),
                recipient_id=notification.get("recipient_id"),
                title=notification.get("title"),
                message=notification.get("message"),
                payload=notification,
                severity=notification.get("severity","INFO"),
                url=notification.get("url"),
                status="UNREAD", 
                created_at=datetime.utcnow(), 
            )
        )
        print("Notification", notification)
        db.add(row)
        db.commit()
        # push notification realtime
        publish_event(
            "notification.created",
            {
                "event_type": "notification.created",
                "notification_id": row.id,
                "recipient_id": row.recipient_id,
                "title": row.title,
                "message": row.message,
                "severity": row.severity,
                "url": row.url,
                "status": row.status
            }
        )