# 🚀 California Reservoir & Car Sound Monitoring System

A real-time, full-stack distributed system for:

- 📊 Monitoring and visualizing historical reservoir data  
- 🔊 Detecting anomalies in motor sounds using a pre-trained machine learning model

---

## 📁 Project Structure

project-root/ ├── data/ │ └── fetch_reservoir_data.py # Publishes 5-year elevation data to MQTT ├── consumer/ │ └── mqtt_consumer.py # Subscribes to data & publishes min/max stats ├── car_analyzer/ │ ├── server.py # Flask API for audio upload and detection │ ├── dcase_mqtt_detector.py # Model inference script │ └── motorsoundsmodel/ # Pre-trained SVM model (given by professor) ├── dashboard/ │ ├── src/components/ │ │ ├── ReservoirDashboard.js # UI for min/max reservoir analytics │ │ ├── ReservoirDashboard.css │ │ ├── MotorSoundAnalysis.js # Upload interface for car sound analysis │ │ └── MotorSoundAnalysis.css ├── mqtt_broker/ │ └── docker-compose.yml # Mosquitto MQTT broker config


---

## ⚙️ Technologies Used

- **Frontend:** React.js, Recharts, Pure CSS, mqtt.js
- **Backend:** Python, Flask, paho-mqtt, requests
- **ML Model:** Pre-trained SVM (provided by professor), joblib, Librosa
- **Messaging:** MQTT (Mosquitto broker via Docker)
- **Data Sources:** California CDEC REST API, DCASE 2021 Motor Dataset
- **Dev Tools:** VS Code, Chrome DevTools

---

## 🧠 Features

### 🔹 Reservoir Data Monitoring

- Fetches and processes 5+ years of daily elevation data for 10 CA reservoirs  
- Publishes data via MQTT to topics like `reservoir/SHA`, `reservoir/ORO`, etc.  
- Real-time consumer aggregates yearly `min/max` elevations  
- React dashboard includes:
  - ✅ Reservoir selector dropdown
  - 🎚️ Year range slider
  - 📈 Line charts (Min/Max elevation per year)
  - 📋 Tabular data summaries

---

### 🔹 Motor Sound Analysis

- Upload `.wav` files through the dashboard  
- Flask API receives and runs ML inference  
- Uses **pre-trained SVM model** to detect anomalies  
- Displays:
  - 🎯 Predicted class
  - 📊 Confidence score
  - 🚨 Anomaly flag

---

## 🚀 How to Run Locally

### 1. Start MQTT Broker
```bash
cd mqtt_broker
docker-compose up -d
2. Run Reservoir Data Publisher
cd data
python fetch_reservoir_data.py
3. Run Reservoir Data Consumer
cd consumer
python mqtt_consumer.py
4. Start Flask Server for Sound Analysis
cd car_analyzer
python server.py
5. Start React Dashboard
cd dashboard
npm install
npm start
🧪 Demo Flow

Reservoir Monitoring
API fetches data for 10 reservoirs
Publishes via MQTT
Consumer computes min/max per year
Dashboard updates charts and table live
Car Sound Detection
User uploads .wav file
Backend runs anomaly detection
Result shown on UI with styled output
📝 Credits

ML Model: Provided by Professor
Datasets:
DCASE 2021 Motor Sounds Dataset
California CDEC Water Reservoir Data
👨‍💻 Author

Samrudh S.
Real-time Systems & Full-Stack Developer
LinkedIn • GitHub

