import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icono personalizado para los marcadores
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535239.png",
  iconSize: [35, 45],
  iconAnchor: [17, 42],
  popupAnchor: [1, -35],
});

const MapaObras = ({ obras }) => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const obtenerCoordenadas = async () => {
      const geocodedObras = await Promise.all(
        obras.map(async (obra) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${obra.direccion}`
            );
            const data = await response.json();
            if (data.length > 0) {
              return {
                id: obra.id,
                nombre: obra.nombre,
                contacto: obra.contacto,
                direccion: obra.direccion,
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
              };
            }
          } catch (error) {
            console.error("Error obteniendo coordenadas:", error);
          }
          return null;
        })
      );
      setMarkers(geocodedObras.filter((obra) => obra !== null));
    };

    obtenerCoordenadas();
  }, [obras]);

  return (
    <div className="mapa-container">
      <MapContainer center={[-34.6037, -58.3816]} zoom={10} className="mapa">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((obra) => (
          <Marker key={obra.id} position={[obra.lat, obra.lon]} icon={customIcon}>
            <Popup>
              <strong>{obra.nombre}</strong> <br />
              📍 {obra.direccion} <br />
              📞 {obra.contacto}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaObras;
