import React, { useEffect, useState, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Circle, Polyline } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapLeaflet.css';
import atcIconImage from '../assets/airplane.png';
import RotatedMarker from './RotatedMarker';
import ZuluClock from './ZuluClock';

const SessionMap = ({ sessionId, setSelectedAtc, setSelectedFlight }) => {
  const [flights, setFlights] = useState([]);
  const [atcs, setAtcs] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const mapRef = useRef();

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
      }, 30000); // Atualiza a cada 2 minutos

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

  const drawStar = (map, latlng, size, options, atc) => {
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
    }).addTo(map).on('click', (e) => {
      setSelectedAtc(atc);
      e.originalEvent.stopPropagation(); // Evita que o clique na estrela acione o manipulador de clique no mapa
    });
    return star;
  };

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
    setSelectedFlight(null); // Limpar a seleção do voo quando clicar no mapa
    setRouteCoordinates([]); // Limpar as coordenadas da rota
  };

  // Função auxiliar para definir a cor baseado na altitude
  const getColorFromAltitude = (altitude) => {
    if (altitude < 3000) return '#FF0000'; // Vermelho para altitudes muito baixas
    if (altitude < 6000) return '#FF4500'; // Laranja avermelhado
    if (altitude < 9000) return '#FF7F00'; // Laranja
    if (altitude < 12000) return '#FFD700'; // Dourado
    if (altitude < 15000) return '#FFFF00'; // Amarelo
    if (altitude < 18000) return '#ADFF2F'; // Verde amarelado
    if (altitude < 21000) return '#00FF00'; // Verde
    if (altitude < 24000) return '#32CD32'; // Verde limão
    if (altitude < 27000) return '#00FA9A'; // Verde médio
    if (altitude < 30000) return '#00FFFF'; // Ciano
    if (altitude < 33000) return '#1E90FF'; // Azul dodger
    if (altitude < 36000) return '#0000FF'; // Azul
    return '#8A2BE2'; // Azul-violeta para altitudes muito altas
  };

  const fetchRoute = async (flightId) => {
    try {
      const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}/flights/${flightId}/route?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
      const routeData = response.data.result.map(point => ({
        latlng: [point.latitude, point.longitude],
        altitude: point.altitude
      }));
      setRouteCoordinates(routeData);
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
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
          eventHandlers={{
            click: (e) => {
              setSelectedFlight(flight);
              fetchRoute(flight.flightId); // Buscar a rota ao clicar no marcador do voo
              e.originalEvent.stopPropagation(); // Evita que o clique no marcador acione o manipulador de clique no mapa
            },
          }}
        />
      ))}
      {routeCoordinates.length > 1 && routeCoordinates.map((point, index) => {
        if (index === 0) return null;
        const prevPoint = routeCoordinates[index - 1];
        const color = getColorFromAltitude((prevPoint.altitude + point.altitude) / 2);
        return (
          <Polyline
            key={index}
            positions={[prevPoint.latlng, point.latlng]}
            color={color}
            weight={2} // Espessura da linha ajustada
          />
        );
      })}
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
          />
        );
      })}
      <ZuluClock />
    </LeafletMap>
  );
};

export default SessionMap;
