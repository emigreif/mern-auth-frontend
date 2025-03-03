// frontend/src/pages/ObraDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ObraDetail = () => {
  const { id } = useParams();
  const [obra, setObra] = useState(null);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchObra = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener la obra");
        const data = await res.json();
        setObra(data);
      } catch (error) {
        console.error("Error fetching obra:", error);
      }
    };

    if (user) {
      fetchObra();
    }
  }, [API_URL, id, user]);

  if (!obra) return <div>Cargando detalle de la obra...</div>;

  return (
    <div className="obra-detail-container">
      <h1>Detalle de Obra</h1>
      <h2>{obra.nombre}</h2>
      <p>Dirección: {obra.direccion}</p>
      {/* Muestra otros detalles necesarios */}
    </div>
  );
};

export default ObraDetail;
