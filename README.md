# 🚀 California Reservoir & Car Sound Monitoring System

A real-time, full-stack distributed system for:

- 📊 Monitoring and visualizing historical reservoir data  
- 🔊 Detecting anomalies in motor sounds using a pre-trained machine learning model

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

