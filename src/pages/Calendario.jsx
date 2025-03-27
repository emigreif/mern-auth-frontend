// src/pages/Calendario.jsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/GlobalStylePages.css";
/**
 * Página "Calendario"
 * - Muestra eventos en FullCalendar
 * - Llama a GET /api/calendario (puede recibir filtros ?obraId=... &actividad=...)
 * - Opcionalmente, filtra por obra/actividad
 */
const Calendario = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [eventos, setEventos] = useState([]);
  const { token } = useAuth();

  // Estados para filtrar
  const [obraId, setObraId] = useState("");
  const [actividad, setActividad] = useState("");

  // Estado de carga y error
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Listas de obras y/o actividades (si deseas un combo real)
  const [obras, setObras] = useState([]);
  const actividadesPosibles = ["medicion", "compraVidrios", "compraPerfiles", "compraAccesorios"];

  // Efecto para cargar la lista de obras (para filtrar)
  useEffect(() => {
    if (!token) return;
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Error al obtener obras");
        const data = await res.json();
        setObras(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchObras();
  }, [token, API_URL]);

  // Efecto para cargar eventos
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setErrorMsg("");

    // Construir la URL con filtros
    let url = `${API_URL}/api/calendario`;
    const params = [];
    if (obraId) params.push(`obraId=${obraId}`);
    if (actividad) params.push(`actividad=${actividad}`);
    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const fetchEventos = async () => {
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al obtener calendario");
        }
        const data = await res.json();
        setEventos(data);
      } catch (error) {
        console.error(error);
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [API_URL, token, obraId, actividad]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Calendario</h1>
        <div className={styles.filters}>
          {/* Filtro por obra */}
          <select value={obraId} onChange={(e) => setObraId(e.target.value)}>
            <option value="">Todas las Obras</option>
            {obras.map((o) => (
              <option key={o._id} value={o._id}>
                {o.nombre}
              </option>
            ))}
          </select>

          {/* Filtro por actividad */}
          <select value={actividad} onChange={(e) => setActividad(e.target.value)}>
            <option value="">Todas las Actividades</option>
            {actividadesPosibles.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className={styles.spinner}>Cargando eventos...</div>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {!loading && eventos.length === 0 && !errorMsg && (
        <div className={styles.noEvents}>No hay eventos para mostrar</div>
      )}

      {!loading && eventos.length > 0 && (
        <div className={styles.calendarWrapper}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={eventos} // data con { title, start, color, etc. }
          />
        </div>
      )}
    </div>
  );
};

export default Calendario;
