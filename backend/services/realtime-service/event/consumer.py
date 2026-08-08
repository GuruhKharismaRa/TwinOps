from kafka import KafkaConsumer
from redis_client import redis_client
import json
import asyncio
import time
from ws.manager import manager
connected_clients = []

async def broadcast(message):

    disconnected = []

    for websocket in connected_clients:
        try:
            await websocket.send_text(json.dumps(message))
        except:
            disconnected.append(websocket)

    for ws in disconnected:
        connected_clients.remove(ws)

def start_consumer(loop):

    while True:

        try:

            consumer = KafkaConsumer(
                'inventory.updated',
                'rack.occupancy.updated',
                'warehouse.task.created',
                'warehouse.task.assigned',
                'warehouse.task.started',
                'warehouse.task.completed', 
                'forklift.position.updated',
                #new
                'notification.created',
                bootstrap_servers='kafka:9092',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='earliest',
                group_id='realtime-group'
            )

            print("CONNECTED TO KAFKA")

            for message in consumer:

                data = message.value

                print("RECEIVED EVENT:", data)

                redis_client.publish("warehouse-events", json.dumps(data))

                event_type = data.get(
                    "event_type"
                )
                
                print(
                    "EVENT TYPE:",
                    event_type
                )

                if (
                    event_type
                    ==
                    "notification.created"
                ):

                    asyncio.run_coroutine_threadsafe(
                        manager.send_to_user(
                            data.get(
                                "recipient_id"
                            ),
                            data
                        ),
                        loop
                    )
                    print(
                        "RECEIVED EVENT:",
                        data
                    )

                else:

                    asyncio.run_coroutine_threadsafe(
                        manager.broadcast(
                            data
                        ),
                        loop
                    )

        except Exception as e:

            print("KAFKA CONNECTION ERROR:", e)

            time.sleep(5)