from fastapi import FastAPI
from fastapi import WebSocket

import asyncio
import threading

from event.consumer import (
    start_consumer
)

from ws.manager import (
    manager
)

app = FastAPI(
    title="Realtime Service"
)

@app.on_event("startup")
async def startup_event():

    loop = asyncio.get_event_loop()

    thread = threading.Thread(
        target=start_consumer,
        args=(loop,),
        daemon=True
    )

    thread.start()

@app.websocket(
    "/ws/{warehouse_id}/{user_id}"
)
async def websocket_endpoint(
    websocket: WebSocket,
    warehouse_id: str,
    user_id: str
):

    await manager.connect(
        websocket,
        warehouse_id,
        user_id
    )

    print(
        f"CLIENT CONNECTED: {user_id}"
    )

    try:

        while True:
            await asyncio.sleep(1)

    except:

        manager.disconnect(
            websocket
        )

        print(
            f"CLIENT DISCONNECTED: {user_id}"
        )

@app.get("/health")
def health():

    return {
        "status": "ok"
    }