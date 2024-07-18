// src/components/SessionMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapLeaflet.css';
import atcIconImage from '../assets/airplane.png';
import RotatedMarker from './RotatedMarker';
import ZuluClock from './ZuluClock';

const SessionMap = ({ sessionId }) => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}/flights?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
        setFlights(response.data.result);
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    };

    if (sessionId) {
      fetchFlights();
      const intervalId = setInterval(fetchFlights, 120000);

      return () => clearInterval(intervalId);
    }
  }, [sessionId]);

  const position = [6.290741153228356, -31.492690383744065];

  const createCustomIcon = () => {
    return new L.Icon({
      iconUrl: atcIconImage,
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
      className: 'atc-icon'
    });
  };

  return (
    <LeafletMap center={position} zoom={3} scrollWheelZoom={true} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {flights.map(flight => (
        <RotatedMarker
          key={flight.flightId}
          position={[flight.latitude, flight.longitude]}
          icon={createCustomIcon()}
          rotationAngle={flight.heading}
          rotationOrigin="center"
        >
          <Popup>
            <div>
              <p><strong>Username:</strong> {flight.username}</p>
              <p><strong>Callsign:</strong> {flight.callsign}</p>
            </div>
          </Popup>
        </RotatedMarker>
      ))}
      <ZuluClock />
    </LeafletMap>
  );
};

export default SessionMap;
