import React from 'react';
import './StatisticsPanel.css';
import WorldSidebar from './WorldSidebar';
import AtcInfoSidebar from './AtcInfoSidebar';

const StatisticsPanel = ({ sessionId, sessionName, selectedAtc }) => {
  return (
    <div className="statistics-panel">
      <div className="statistics-header">
        <h3>Infinite Monitor Live</h3>
        <p>1.0v Alpha</p>
      </div>
      <div className="statistics-session">
        <h4>{sessionName}</h4>
      </div>
      <div style={{ padding: '20px' }}>
        {selectedAtc ? (
          <AtcInfoSidebar atc={selectedAtc} />
        ) : (
          <WorldSidebar sessionId={sessionId} sessionName={sessionName} />
        )}
      </div>
    </div>
  );
};

export default StatisticsPanel;
