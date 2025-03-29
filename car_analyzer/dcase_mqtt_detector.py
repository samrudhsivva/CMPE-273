import os
import sys
import json
import joblib
import numpy as np
import soundfile as sf
import librosa

# Check for command-line argument
if len(sys.argv) != 2:
    print(json.dumps({"error": "Missing audio file argument"}))
    sys.exit(1)

audio_path = sys.argv[1]
if not os.path.exists(audio_path):
    print(json.dumps({"error": "File not found"}))
    sys.exit(1)

# Load the trained model
MODEL_DIR = "car_analyzer/motorsoundsmodel"
MODEL_PATH = os.path.join(MODEL_DIR, "motorsoundsmodel")
model = joblib.load(MODEL_PATH)

# Load mean normalization (optional)
means = None
mean_path = os.path.join(MODEL_DIR, "motorsoundsmodelMEANS")
if os.path.exists(mean_path):
    means = joblib.load(mean_path)

def extract_features(file_path):
    y, sr = sf.read(file_path)
    if y.ndim > 1:
        y = y[:, 0]  # Convert to mono

    n_mels = 64
    mel = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=1024, hop_length=512, n_mels=n_mels, fmin=50, fmax=8000)
    log_mel = librosa.power_to_db(mel)

    mean = np.mean(log_mel, axis=1)
    std = np.std(log_mel, axis=1)
    duration = np.array([y.shape[0] / sr])
    features = np.concatenate([mean, std, duration])
    features = np.pad(features, (0, 136 - len(features)), mode='constant')
    return features.reshape(1, -1)

# Extract features
features = extract_features(audio_path)

# Optional normalization
# if means is not None:
#     features = features - means

# Predict
decision_scores = model.decision_function(features)
score = float(decision_scores[0]) if hasattr(decision_scores[0], '__len__') == False else float(decision_scores[0][0])
label = model.predict(features)[0]
is_anomaly = int(score < 0.0)

result = {
    "filename": os.path.basename(audio_path),
    "predicted_class": str(label),
    "confidence": round(score, 5),
    "anomaly": bool(is_anomaly)
}

print(json.dumps(result))

