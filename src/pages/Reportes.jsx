// frontend/src/pages/Reportes.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reportes`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener reportes");
        const data = await res.json();
        setReportes(data);
      } catch (error) {
        console.error("Error fetching reportes:", error);
      }
    };

    if (user) {
      fetchReportes();
    }
  }, [API_URL, user]);

  return (
    <div className="reportes-container">
      <h1>Reportes</h1>
      {reportes.length === 0 ? (
        <p>No hay reportes disponibles.</p>
      ) : (
        reportes.map((rep) => (
          <div key={rep._id} className="reporte-card">
            <h2>{rep.categoria}</h2>
            <p>{rep.descripcion}</p>
            <p>Fecha: {rep.fecha}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Reportes;
