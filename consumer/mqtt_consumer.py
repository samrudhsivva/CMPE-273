import paho.mqtt.client as mqtt
import json
from collections import defaultdict
from datetime import datetime

# MQTT client to publish results back
publisher = mqtt.Client()
publisher.connect("localhost", 1883)

# To hold raw elevation values grouped by year
reservoir_data = defaultdict(lambda: defaultdict(list))

def on_connect(client, userdata, flags, rc):
    print("Connected with result code", rc)
    for res_id in ['SHA', 'ORO', 'CLE', 'NML', 'SNL', 'DNP', 'BER', 'FOL', 'BUL', 'PNF']:
        client.subscribe(f"reservoir/{res_id}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        station_id = msg.topic.split("/")[-1]
        data_list = payload if isinstance(payload, list) else [payload]

        for entry in data_list:
            date_str = entry.get('date')
            value = entry.get('value')
            if date_str and value:
                year = datetime.strptime(date_str.split()[0], "%Y-%m-%d").year
                reservoir_data[station_id][year].append(value)

        # Build min/max stats
        yearly_summary = []
        for year, values in sorted(reservoir_data[station_id].items()):
            yearly_summary.append({
                "year": year,
                "min": min(values),
                "max": max(values)
            })

        print(f"➡️  Payload for {station_id}:")
        print(json.dumps(yearly_summary, indent=2))

        # Publish to new topic
        publisher.publish(f"reservoir_stats/{station_id}", json.dumps(yearly_summary))
        print(f"Published stats to reservoir_stats/{station_id}")

    except Exception as e:
        print("Error:", e)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("localhost", 1883, 60)
client.loop_forever()
