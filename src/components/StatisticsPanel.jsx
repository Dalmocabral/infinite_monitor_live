import React from 'react';
import './StatisticsPanel.css';
import WorldSidebar from './WorldSidebar';

const StatisticsPanel = ({ sessionId, sessionName}) => {
  return (
    <div className="statistics-panel">
      <div className="statistics-header">
        <h3>Infinite Monitor Live</h3>
        <p>1.0v Alpha</p>
      </div>
      <div style={{ padding: '20px' }}>
     
          <WorldSidebar sessionId={sessionId} sessionName={sessionName} />
        
      </div>
    </div>
  );
};

export default StatisticsPanel;
