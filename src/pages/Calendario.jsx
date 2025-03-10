/* import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth } from "../context/AuthContext.jsx";

const CalendarioProduccion = () => {
  const { user } = useAuth();

  const [eventos, setEventos] = useState([]);
  const [obras, setObras] = useState([]); 
  const [obraSeleccionada, setObraSeleccionada] = useState("");
  const [actividadSeleccionada, setActividadSeleccionada] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    title: "",
    date: "",
    type: "Entrega",
    obraId: "",
  });

  // Ajusta la URL de tu backend
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 1. Cargar lista de obras
  const cargarObras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener obras");
      const data = await res.json();
      setObras(data);
    } catch (error) {
      console.error("Error cargando obras:", error);
    }
  };

  // 2. Cargar eventos del calendario (filtrados si hay obra o actividad)
  const cargarCalendario = async () => {
    if (!user) return; // Si no hay usuario, no hacemos fetch
    try {
      let url = `${API_URL}/api/calendario`;
      const params = [];

      if (obraSeleccionada) {
        params.push(`obraId=${obraSeleccionada}`);
      }
      if (actividadSeleccionada) {
        params.push(`actividad=${actividadSeleccionada}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Error cargando calendario");
      const data = await res.json();
      setEventos(data);
    } catch (error) {
      console.error("Error cargando calendario:", error);
    }
  };

  // Al montar, cargar obras si hay usuario
  useEffect(() => {
    if (user) {
      cargarObras();
    }
  }, [user]);

  // Cada vez que cambien los filtros o el usuario, recargar eventos
  useEffect(() => {
    if (user) {
      cargarCalendario();
    }
  }, [obraSeleccionada, actividadSeleccionada, user]);

  // Guardar un nuevo evento
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/calendario`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(nuevoEvento),
      });
      if (!response.ok) throw new Error("Error al agregar evento");
      alert("Evento agregado correctamente");
      setModalOpen(false);
      cargarCalendario(); // Recargar la lista de eventos
    } catch (error) {
      console.error("Error:", error);
      alert("Error al agregar evento");
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Calendario de Producción</h1>

        {/* Filtros 
        <label>Filtrar por Obra:</label>
        <select
          value={obraSeleccionada}
          onChange={(e) => setObraSeleccionada(e.target.value)}
        >
          <option value="">Todas</option>
          {obras.map((obra) => (
            <option key={obra._id} value={obra._id}>
              {/* Muestra la info de obra que necesites 
              {obra.nombre}
            </option>
          ))}
        </select>

        <label>Filtrar por Actividad:</label>
        <select
          value={actividadSeleccionada}
          onChange={(e) => setActividadSeleccionada(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="medicion">Medición</option>
          <option value="compraVidrios">Compra Vidrios</option>
          <option value="compraPerfiles">Compra Perfiles</option>
          <option value="inicioProduccion">Inicio Producción</option>
          <option value="montaje">Montaje</option>
        </select>

        {/* Calendario 
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={eventos} // Debe ser un array con objetos { title, date, ... }
        />

        {/* Botón para abrir el modal y agregar evento 
        <button
          onClick={() => setModalOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#007bff",
            color: "white",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "24px",
            cursor: "pointer",
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          +
        </button>

        {/* Modal para agregar evento 
        {modalOpen && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              zIndex: 1000,
            }}
          >
            <h3>Agregar Evento</h3>
            <input
              type="text"
              placeholder="Título"
              value={nuevoEvento.title}
              onChange={(e) =>
                setNuevoEvento({ ...nuevoEvento, title: e.target.value })
              }
            />
            <input
              type="date"
              value={nuevoEvento.date}
              onChange={(e) =>
                setNuevoEvento({ ...nuevoEvento, date: e.target.value })
              }
            />
            <select
              value={nuevoEvento.type}
              onChange={(e) =>
                setNuevoEvento({ ...nuevoEvento, type: e.target.value })
              }
            >
              <option value="Entrega">Entrega en Obra</option>
              <option value="Producción">Nueva Producción</option>
            </select>

            {/* Seleccionar Obra para el evento 
            <label>Seleccionar Obra:</label>
            <select
              value={nuevoEvento.obraId}
              onChange={(e) =>
                setNuevoEvento({ ...nuevoEvento, obraId: e.target.value })
              }
            >
              <option value="">Selecciona una obra</option>
              {obras.map((obra) => (
                <option key={obra._id} value={obra._id}>
                  {obra.nombre}
                </option>
              ))}
            </select>

            <br />
            <button onClick={handleSubmit}>Guardar</button>
            <button onClick={() => setModalOpen(false)}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioProduccion;
 */
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
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Calendario</h1>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={eventos} // data con { title, start, color, etc. }
        />
      </div>
    </div>
  );
};

export default Calendario;
