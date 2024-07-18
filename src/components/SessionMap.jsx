// src/components/SessionMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './MapLeaflet.css';

const SessionMap = ({ sessionId }) => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    if (sessionId) {
      const fetchFlights = async () => {
        try {
          const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}/flights?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`, {
            
          });
          setFlights(response.data.result);
        } catch (error) {
          console.error('Error fetching flight data:', error);
        }
      };

      fetchFlights();
    }
  }, [sessionId]);

  const position = [6.290741153228356, -31.492690383744065];

  return (
    <LeafletMap center={position} zoom={3} scrollWheelZoom={false} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {flights.map(flight => (
        <Marker key={flight.flightId} position={[flight.latitude, flight.longitude]}>
          <Popup>
            <div>
              <p><strong>Username:</strong> {flight.username}</p>
              <p><strong>Callsign:</strong> {flight.callsign}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </LeafletMap>
  );
};

export default SessionMap;
