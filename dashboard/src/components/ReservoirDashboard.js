import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './ReservoirDashboard.css';

const CDEC_IDS = ['SHA', 'ORO', 'CLE', 'NML', 'SNL', 'DNP', 'BER', 'FOL', 'BUL', 'PNF'];

const ReservoirDashboard = () => {
  const [yearlyStats, setYearlyStats] = useState({});
  const [selectedReservoir, setSelectedReservoir] = useState('ALL');
  const [yearRange, setYearRange] = useState([2020, 2025]);

  useEffect(() => {
    const client = mqtt.connect('ws://localhost:9001');
    client.on('connect', () => {
      CDEC_IDS.forEach(id => client.subscribe(`reservoir_stats/${id}`));
    });

    client.on('message', (topic, message) => {
      const reservoirId = topic.split("/")[1];
      try {
        const data = JSON.parse(message.toString());
        setYearlyStats(prev => ({
          ...prev,
          [reservoirId]: Array.isArray(data) ? data : [data]
        }));
      } catch (e) {
        console.error("Parsing error:", e);
      }
    });

    return () => client.end();
  }, []);

  const filteredYears = (data) =>
    data.filter(entry => entry.year >= yearRange[0] && entry.year <= yearRange[1]);

  const reservoirsToShow =
    selectedReservoir === 'ALL'
      ? CDEC_IDS
      : [selectedReservoir];

  return (
    <div className="res-dashboard">
      <div className="filter-bar">
        <div className="filter-item">
          <label>Select Reservoir:</label>
          <select onChange={e => setSelectedReservoir(e.target.value)} value={selectedReservoir}>
            <option value="ALL">All Reservoirs</option>
            {CDEC_IDS.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Year Range: {yearRange[0]} – {yearRange[1]}</label>
          <input
            type="range"
            min="2020"
            max="2025"
            value={yearRange[0]}
            onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
          />
          <input
            type="range"
            min="2020"
            max="2025"
            value={yearRange[1]}
            onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
          />
        </div>
      </div>

      {reservoirsToShow.map(id => (
        <div key={id} className="res-card">
          <h2>{id} – Yearly Min/Max</h2>
          {yearlyStats[id] && filteredYears(yearlyStats[id]).length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredYears(yearlyStats[id])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="min" stroke="#14b8a6" name="Min Elevation" />
                  <Line type="monotone" dataKey="max" stroke="#f97316" name="Max Elevation" />
                </LineChart>
              </ResponsiveContainer>

              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Min (ft)</th>
                    <th>Max (ft)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredYears(yearlyStats[id]).map((entry, i) => (
                    <tr key={i}>
                      <td>{entry.year}</td>
                      <td>{entry.min}</td>
                      <td>{entry.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="placeholder">No data for selected years</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReservoirDashboard;
