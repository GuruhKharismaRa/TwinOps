from services.notifications.providers.in_app_provider import ( InAppProvider )
from services.notifications.providers.email_provider import ( EmailProvider )
from services.notifications.providers.telegram_provider import ( TelegramProvider )
from services.notifications.template_engine import (TemplateEngine)
 
class NotificationEngine:

    PROVIDERS = {
        "IN_APP": InAppProvider(), 
        "EMAIL": EmailProvider(),
        "TELEGRAM": TelegramProvider()
    }
    @staticmethod
    def notify(
        db,
        notification, 
        channels=None
    ):

        if channels is None:
            channels = ["IN_APP"]
        
        for channel in channels:
            provider = (
                NotificationEngine.PROVIDERS.get(channel)
            )

            if provider:
                provider.send(
                    db,
                    notification
                )
    
    @staticmethod
    def notify_template(
        db,
        recipient_id,
        template_name,
        context=None,
        channels=None
    ):
        if context is None:
            context = {}
        notification = (
            TemplateEngine.render(
                template_name, 
                context         
            )
        )
        
        #inject recipient
        notification["recipient_id"] = recipient_id
        print(
    "NOTIFICATION PAYLOAD:",
    notification
)
        NotificationEngine.notify(
            db=db, 
            notification=notification,
            channels=channels
        )
