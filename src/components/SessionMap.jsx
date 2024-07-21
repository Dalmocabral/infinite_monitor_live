import React, { useEffect, useState, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapLeaflet.css';
import atcIconImage from '../assets/airplane.png';
import RotatedMarker from './RotatedMarker';
import ZuluClock from './ZuluClock';

const SessionMap = ({ sessionId, setSelectedAtc }) => {
  const [flights, setFlights] = useState([]);
  const [atcs, setAtcs] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}/flights?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
        setFlights(response.data.result);
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    };

    const fetchAtcs = async () => {
      try {
        const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}/atc?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
        setAtcs(response.data.result);
      } catch (error) {
        console.error('Error fetching ATC data:', error);
      }
    };

    if (sessionId) {
      fetchFlights();
      fetchAtcs();
      const intervalId = setInterval(() => {
        fetchFlights();
        fetchAtcs();
      }, 120000); // Atualiza a cada 2 minutos

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

  const drawStar = (map, latlng, size, options) => {
    const angle = Math.PI / 4;
    const points = [];
    for (let i = 0; i < 8; i++) {
      const radius = i % 2 === 0 ? size : size / 3; // Ajuste o raio das pontas menores para tornar a estrela mais fina
      points.push([
        latlng.lat + radius * Math.cos(angle * i) * (180 / Math.PI) / 111320,
        latlng.lng + radius * Math.sin(angle * i) * (180 / Math.PI) / (111320 * Math.cos(latlng.lat * (Math.PI / 180)))
      ]);
    }
    points.push(points[0]); // Fechar o polígono

    const star = L.polygon(points, {
      ...options,
      weight: 1, // Ajuste a largura da borda da estrela
      color: 'black', // Cor da borda da estrela
      fillColor: 'yellow', // Cor de preenchimento da estrela
      fillOpacity: 0.2 // Opacidade do preenchimento da estrela
    }).addTo(map).bindPopup(`
      <div>
        <p><strong>ATC Type:</strong> Ground</p>
      </div>
    `);
    return star;
  };

  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current) {
      atcs.forEach(atc => {
        if (atc.type === 0) { // Ground
          drawStar(mapRef.current, L.latLng(atc.latitude, atc.longitude), 325, { color: '#e9eaba', fillColor: '#e9eaba', fillOpacity: 0.2, weight: 1 });
        }
      });
    }
  }, [atcs]);

  // Função para obter a cor e o raio do marcador com base no tipo de ATC
  const getAtcMarkerProps = (type) => {
    let markerColor;
    let markerRadius;

    switch (type) {
      case 0: // Ground
        markerColor = '#1c186e';
        markerRadius = 60000;
        break;
      case 1: // Tower
        markerColor = '#eca3b6';
        markerRadius = 18520;
        break;
      case 4: // Approach
      case 5: // Departure
        markerColor = '#699fe9';
        markerRadius = 33333;
        break;
      case 2: // Unicom
        markerColor = 'green';
        markerRadius = 25000;
        break;
      default: // Other types
        markerColor = '#1c186e';
        markerRadius = 5000;
    }

    return { color: markerColor, radius: markerRadius, weight: 1 }; // Ajuste o valor de `weight` para afinar a borda dos círculos
  };

  const handleMapClick = () => {
    setSelectedAtc(null);
  };

  return (
    <LeafletMap ref={mapRef} center={position} zoom={3} scrollWheelZoom={true} className="map-container" onClick={handleMapClick}>
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
      {atcs.map(atc => {
        const { color, radius, weight } = getAtcMarkerProps(atc.type);
        return atc.type !== 0 && (
          <Circle
            key={atc.frequencyId}
            center={[atc.latitude, atc.longitude]}
            radius={radius}
            color={color}
            fillColor={color} // Se desejar que o preenchimento tenha a mesma cor
            fillOpacity={0.5} // Ajuste a opacidade conforme necessário
            weight={weight} // Ajuste a espessura da borda do círculo
            eventHandlers={{
              click: (e) => {
                setSelectedAtc(atc);
                e.originalEvent.stopPropagation(); // Evita que o clique no marcador de ATC acione o manipulador de clique no mapa
              },
            }}
          >
            <Popup>
              <div>
                <p><strong>Username:</strong> {atc.username}</p>
                <p><strong>Airport:</strong> {atc.airportName}</p>
                <p><strong>Type:</strong> {['Ground', 'Tower', 'Unicom', 'Clearance', 'Approach', 'Departure', 'Center', 'ATIS', 'Aircraft', 'Recorded', 'Unknown', 'Unused'][atc.type]}</p>
                <p><strong>Start Time:</strong> {new Date(atc.startTime).toLocaleString()}</p>
              </div>
            </Popup>
          </Circle>
        );
      })}
      <ZuluClock />
    </LeafletMap>
  );
};

export default SessionMap;
