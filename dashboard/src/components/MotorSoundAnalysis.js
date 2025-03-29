import React, { useState } from 'react';
import './MotorSoundAnalysis.css';

const MotorSoundAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.wav')) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const uploadToBackend = async () => {
    if (!selectedFile) return;

    setUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData
      });

      const res = await response.json();
      setUploadStatus('✅ Uploaded');
      setResult(res);
    } catch (err) {
      console.error(err);
      setUploadStatus('❌ Upload failed');
    }
  };

  return (
    <div className="motor-wrapper">
      <h2>🎧 Motor Sound Analysis</h2>

      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p>📂 Drag and drop a `.wav` file here</p>
        <input
          type="file"
          accept=".wav"
          onChange={handleFileChange}
          id="file-upload"
        />
        <label htmlFor="file-upload">or browse files</label>
      </div>

      {selectedFile && (
        <div className="selected">
          🎵 File selected: <strong>{selectedFile.name}</strong>
        </div>
      )}

      <button onClick={uploadToBackend} disabled={!selectedFile}>
        Upload & Analyze
      </button>

      <div className="upload-status">{uploadStatus}</div>

      {result && (
        <div className="result-box">
          <h3>📊 Results</h3>
          <p><strong>File:</strong> {result.filename}</p>
          <p><strong>Predicted Class:</strong> {result.predicted_class}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p><strong>Anomaly:</strong> {result.anomaly ? '❌ Yes' : '✅ No'}</p>
        </div>
      )}
    </div>
  );
};

export default MotorSoundAnalysis;
