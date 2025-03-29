import requests
import time
import paho.mqtt.client as mqtt
import json

CDEC_IDS = ['SHA', 'ORO', 'CLE', 'NML', 'SNL', 'DNP', 'BER', 'FOL', 'BUL', 'PNF']
BROKER = 'localhost'
PORT = 1883

def fetch_data(reservoir_id):
    url = f"https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations={reservoir_id}&SensorNums=6&dur_code=D&Start=2020-01-01&End=2025-03-28"
    try:
        response = requests.get(url)
        return response.json()
    except Exception as e:
        print(f"Failed to fetch data for {reservoir_id}: {e}")
        return None

client = mqtt.Client()
client.connect(BROKER, PORT)

while True:
    for res_id in CDEC_IDS:
        data = fetch_data(res_id)
        if data:
            topic = f"reservoir/{res_id}"
            client.publish(topic, json.dumps(data))
            print(f"Published to {topic}")
    time.sleep(60)  # Fetch every minute
