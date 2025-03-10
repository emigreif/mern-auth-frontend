// src/components/MapaObras.jsx
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapaObras = ({ obras }) => {
  const mapContainerStyle = { width: "100%", height: "400px" };
  const center = { lat: -34.603722, lng: -58.381592 }; // Ejemplo: Buenos Aires

  return (
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
  );
};

export default MapaObras;
