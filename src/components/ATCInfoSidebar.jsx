// ATCInfoSidebar.js
import React from 'react';
import './ATCInfoSidebar.css';

const ATCInfoSidebar = ({ atc, onClose }) => {
  if (!atc) return null;

  return (
    <div className="atc-info-sidebar">
      <button onClick={onClose} className="close-btn">X</button>
      <h2>ATC Information</h2>
      <p><strong>Username:</strong> {atc.username}</p>
      <p><strong>Airport:</strong> {atc.airportName}</p>
      <p><strong>Type:</strong> {['Ground', 'Tower', 'Unicom', 'Clearance', 'Approach', 'Departure', 'Center', 'ATIS', 'Aircraft', 'Recorded', 'Unknown', 'Unused'][atc.type]}</p>
      <p><strong>Start Time:</strong> {new Date(atc.startTime).toLocaleString()}</p>
    </div>
  );
};

export default ATCInfoSidebar;
