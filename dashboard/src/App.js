import React, { useState } from 'react';
import './App.css';
import ReservoirDashboard from './components/ReservoirDashboard';
import MotorSoundAnalysis from './components/MotorSoundAnalysis';

const App = () => {
  const [activeTab, setActiveTab] = useState('reservoir');

  return (
    <div className="app">
      <nav className="navbar">
        <h1>🌐 California Water & Car Analyzer</h1>
        <div className="tabs">
          <button onClick={() => setActiveTab('reservoir')} className={activeTab === 'reservoir' ? 'active' : ''}>Reservoir Dashboard</button>
          <button onClick={() => setActiveTab('motor')} className={activeTab === 'motor' ? 'active' : ''}>Motor Sound Analysis</button>
        </div>
      </nav>
      
      <main>
        {activeTab === 'reservoir' ? <ReservoirDashboard /> : <MotorSoundAnalysis />}
      </main>
    </div>
  );
};

export default App;
