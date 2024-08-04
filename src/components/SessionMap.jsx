import React, { useEffect, useState, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Circle, Polyline } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapLeaflet.css';
import atcIconImage from '../assets/airplane.png';
import RotatedMarker from './RotatedMarker';
import ZuluClock from './ZuluClock';
import aircraftData from './dataSetIconAircraft.json';

const SessionMap = ({ sessionId, setSelectedAtc, setSelectedFlight }) => {
  const [flights, setFlights] = useState([]);
  const [atcs, setAtcs] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [flightPlanCoordinates, setFlightPlanCoordinates] = useState([]);

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
      }, 30000); // Atualiza a cada 30 segundos

      return () => clearInterval(intervalId);
    }
  }, [sessionId]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      // Define os limites (bounding box)
      const southWest = L.latLng(-90, -180);
      const northEast = L.latLng(90, 180);
      const bounds = L.latLngBounds(southWest, northEast);

      map.leafletElement.setMaxBounds(bounds);
      map.leafletElement.setMaxBounds(bounds).setMaxBoundsViscosity(1.0);
    }
  }, []);

  const position = [6.290741153228356, -31.492690383744065];

  const getAircraftIcon = (aircraftId) => {
    for (const category in aircraftData) {
      const aircraft = aircraftData[category].find(a => a.id === aircraftId);
      if (aircraft) {
        return new L.Icon({
          iconUrl: aircraft.icon,
          iconSize: aircraft.iconSize || [25, 25], // Tamanho padrão se não especificado
          iconAnchor: [15, 15],
          popupAnchor: [0, -15]
        });
      }
    }
    // Retorna um ícone padrão se não encontrar o ID
    return new L.Icon({
      iconUrl: atcIconImage,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
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
        markerColor = '#0e7c33';
        markerRadius = 5000;
    }

    return { color: markerColor, radius: markerRadius, weight: 1 }; // Ajuste o valor de `weight` para afinar a borda dos círculos
  };

  const handleMapClick = () => {
    setSelectedAtc(null);
    setSelectedFlight(null); // Limpar a seleção do voo quando clicar no mapa
    setRouteCoordinates([]); // Limpar as coordenadas da rota
    setFlightPlanCoordinates([]); // Limpar as coordenadas do plano de voo
  };

  // Função auxiliar para definir a cor baseado na altitude
  const getColorFromAltitude = (altitude) => {
    if (altitude < 100) return '#FF0000';
    if (altitude < 2000) return '#FF4500';
    if (altitude < 3000) return '#FFFF00';
    if (altitude < 5000) return '#00FF00';
    if (altitude < 10000) return '#32CD32';
    if (altitude < 15000) return '#00FA9A';
    if (altitude < 20000) return '#00FFFF';
    if (altitude < 25000) return '#1E90FF';
    return '#0000FF';
  };

  const fetchRoute = async (flightId) => {
    try {
      const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}/flights/${flightId}/route?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
      const routeData = response.data.result.map(point => ({
        latlng: [point.latitude, point.longitude],
        altitude: point.altitude
      }));

      // Obtenha a posição atual da aeronave
      const flight = flights.find(f => f.flightId === flightId);
      if (flight) {
        routeData.push({
          latlng: [flight.latitude, flight.longitude],
          altitude: flight.altitude
        });
      }

      setRouteCoordinates(routeData);
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

  const fetchFlightPlan = async (flightId) => {
    try {
      const response = await axios.get(`https://api.infiniteflight.com/public/v2/sessions/${sessionId}/flights/${flightId}/flightplan?apikey=nvo8c790hfa9q3duho2jhgd2jf8tgwqw`);
      const flightPlanData = response.data.result.flightPlanItems
        .filter(item => item.location.latitude !== 0 && item.location.longitude !== 0)
        .map(item => ({
          latlng: [item.location.latitude, item.location.longitude]
        }));
      setFlightPlanCoordinates(flightPlanData);
    } catch (error) {
      console.error('Error fetching flight plan data:', error);
    }
  };

  const splitLineAtDateLine = (points) => {
    let splitLines = [];
    let currentLine = [points[0]];
  
    for (let i = 1; i < points.length; i++) {
      const [prevLat, prevLng] = currentLine[currentLine.length - 1];
      const [currentLat, currentLng] = points[i];
  
      // Verifica se cruzou a Linha Internacional de Data
      if (Math.abs(currentLng - prevLng) > 180) {
        // Ajusta a longitude para que a linha seja desenhada corretamente
        const adjustedLng = currentLng > 0 ? currentLng - 360 : currentLng + 360;
        currentLine.push([currentLat, adjustedLng]);
        splitLines.push(currentLine);
        currentLine = [[currentLat, currentLng]];
      } else {
        currentLine.push([currentLat, currentLng]);
      }
    }
  
    splitLines.push(currentLine);
    return splitLines;
  };
  

  return (
    <LeafletMap
      ref={mapRef}
      center={position}
      zoom={3}
      scrollWheelZoom={true}
      className="map-container"
      onClick={handleMapClick}
      
      
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {flights.map(flight => (
        <RotatedMarker
          key={flight.flightId}
          position={[flight.latitude, flight.longitude]}
          icon={getAircraftIcon(flight.aircraftId)} // Use a função para obter o ícone correto
          rotationAngle={flight.heading}
          rotationOrigin="center"
          eventHandlers={{
            click: (e) => {
              setSelectedFlight(flight);
              fetchRoute(flight.flightId); // Buscar a rota ao clicar no marcador do voo
              fetchFlightPlan(flight.flightId); // Buscar o plano de voo ao clicar no marcador do voo
              e.originalEvent.stopPropagation(); // Evita que o clique no marcador acione o manipulador de clique no mapa
            },
          }}
        />
      ))}
      {routeCoordinates.length > 1 && splitLineAtDateLine(routeCoordinates.map(point => point.latlng)).map((line, index) => (
       
        <Polyline
          key={index}
          positions={line}
          color="blue"
          weight={2} // Espessura da linha ajustada
        />
      ))}
      {flightPlanCoordinates.length > 1 && splitLineAtDateLine(flightPlanCoordinates.map(item => item.latlng)).map((line, index) => (
        <Polyline
          key={index}
          positions={line}
          color="black"
          weight={1}
          dashArray="5, 5" // Define o estilo pontilhado
        />
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
          />
        );
      })}
      <ZuluClock />
    </LeafletMap>
  );
};

export default SessionMap;
