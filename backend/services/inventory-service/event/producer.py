from kafka import KafkaProducer
import json
import time

def publish_event(topic, data):

    while True:

        try:

            producer = KafkaProducer(
                bootstrap_servers='kafka:9092',
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )

            print("CONNECTED TO KAFKA")

            producer.send(topic, data)

            producer.flush()

            print("PUBLISH EVENT:", data)

            break

        except Exception as e:

            print("KAFKA ERROR:", e)

            time.sleep(5)