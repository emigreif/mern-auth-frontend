import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapaObras = ({ obras }) => {
  const mapContainerStyle = { width: "100%", height: "400px" };
  const center = { lat: -34.603722, lng: -58.381592 };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center}>
        {obras.map((obra) => (
          <Marker key={obra.id} position={{ lat: obra.lat, lng: obra.lng }} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapaObras;
