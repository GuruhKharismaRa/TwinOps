from fastapi import WebSocket
 
class ConnectionManager:

    def __init__(self):

        self.connections = []

    async def connect(
        self,
        websocket: WebSocket,
        warehouse_id: str,
        user_id: str
    ):

        await websocket.accept()

        self.connections.append({
            "ws": websocket,
            "warehouse_id": warehouse_id,
            "user_id": user_id
        })

    def disconnect(
        self,
        websocket: WebSocket
    ):

        self.connections = [
            conn
            for conn in self.connections
            if conn["ws"] != websocket
        ]

    async def broadcast(
        self,
        event: dict
    ):

        for conn in self.connections:

            if (
                event.get("warehouse_id") == conn["warehouse_id"]
            ):

                await conn["ws"].send_json(
                    event
                )

    async def send_to_user(
        self,
        user_id,
        event
    ):

        for conn in self.connections:

            if (
                conn["user_id"]
                ==
                user_id
            ):

                await conn["ws"].send_json(
                    event
                )

manager = ConnectionManager()