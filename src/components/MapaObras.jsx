import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Definir icono personalizado para el marcador
const customIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Maps_pin.svg",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
});

// Coordenadas de ejemplo
const obras = [
  { id: 1, nombre: "Edificio Central", direccion: "Av. Principal 123", lat: -34.6037, lng: -58.3816 },
  { id: 2, nombre: "Torre Norte", direccion: "Calle Secundaria 456", lat: -34.605, lng: -58.383 },
];

const MapaObras = () => {
  return (
    <div className="mapa-container">
      <h2>Mapa de Obras</h2>
      <MapContainer center={[-34.6037, -58.3816]} zoom={13} className="mapa">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {obras.map((obra) => (
          <Marker key={obra.id} position={[obra.lat, obra.lng]} icon={customIcon}>
            <Popup>
              <strong>{obra.nombre}</strong>
              <br />
              {obra.direccion}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaObras;
