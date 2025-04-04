import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapaObras = ({ obras }) => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const center = { lat: -34.603722, lng: -58.381592 }; // Ej: Buenos Aires

  return (
    <div style={{ padding: "1rem", marginBottom: "1rem" }}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
        >
          {obras.map((obra, index) => (
            <Marker
              key={index}
              position={{ lat: obra.lat, lng: obra.lng }}
              title={obra.nombre}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapaObras;
