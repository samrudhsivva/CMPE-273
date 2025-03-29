from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import subprocess
import json

app = Flask(__name__)
CORS(app)

UPLOAD_DIR = "car_analyzer/test_audio"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if not file.filename.endswith('.wav'):
        return jsonify({"error": "Invalid file type"}), 400

    filename = f"{uuid.uuid4()}.wav"
    filepath = os.path.join(UPLOAD_DIR, filename)
    file.save(filepath)

    print(f"✅ File saved: {filepath}")

    try:
        # Run your MQTT detector
        result = subprocess.check_output(["python3", "car_analyzer/dcase_mqtt_detector.py", filepath])
        result_json = json.loads(result.decode("utf-8").strip())
        return jsonify(result_json)
    except Exception as e:
        print("❌ Detection failed:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
