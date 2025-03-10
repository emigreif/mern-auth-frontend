
// src/pages/Calendario.jsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useAuth } from "../context/AuthContext.jsx";

const Calendario = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/calendario`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener calendario");
        const data = await res.json();
        setEventos(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEventos();
  }, [API_URL]);

  return (
   
      <div className="page-contenedor">
        <h1>Calendario</h1>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={eventos} // data con { title, start, color, etc. }
        />
      </div>
    
  );
};

export default Calendario;
