// frontend/src/pages/Calendario.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/calendario`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener eventos");
        const data = await res.json();
        setEventos(data);
      } catch (error) {
        console.error("Error fetching eventos:", error);
      }
    };

    if (user) {
      fetchEventos();
    }
  }, [API_URL, user]);

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Calendario de Producción</h1>
        {eventos.length === 0 ? (
          <p>No hay eventos registrados.</p>
        ) : (
          eventos.map((evento) => (
            <div
              key={evento._id}
              className={`evento ${evento.tipo.toLowerCase()}`}
            >
              <span className="fecha">{evento.fecha}</span>
              <span className="tipo">{evento.tipo}</span>
              <span className="obra">{evento.obra}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Calendario;
