// src/components/MapLeaflet.jsx
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import "./MapLeaflet.css";

const MapLeaflet = () => {
  const position = [6.290741153228356, -31.492690383744065];
  
  return (
    <LeafletMap
      center={position}
      zoom={3}
      scrollWheelZoom={false}
      
      className="map-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </LeafletMap>
  );
};

export default MapLeaflet;
