import React from 'react';
import './UserInfoSidebar.css';

const UserInfoSidebar = ({ flight, sessionId }) => {
  const handleClickInside = (e) => {
    e.stopPropagation(); // Prevenir a propagação do evento de clique
  };

  return (
    <div className="user-info-sidebar" onClick={handleClickInside}>
      <h2>Flight Information</h2>
      <p><strong>Flight ID:</strong> {flight.flightId}</p>
      <p><strong>Latitude:</strong> {flight.latitude}</p>
      <p><strong>Longitude:</strong> {flight.longitude}</p>
      <p><strong>Heading:</strong> {flight.heading}</p>
      <p><strong>Altitude:</strong> {flight.altitude}</p>
      <p><strong>Session ID:</strong> {sessionId}</p> {/* Exibir o sessionId para confirmação */}
      {/* Adicione outras informações relevantes do voo aqui */}
    </div>
  );
};

export default UserInfoSidebar;
