// src/pages/Calendario.jsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";

const Calendario = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { token } = useAuth();

  const [eventos, setEventos] = useState([]);
  const [obraId, setObraId] = useState("");
  const [actividad, setActividad] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [obras, setObras] = useState([]);
  const actividadesPosibles = ["medicion", "compraVidrios", "compraPerfiles", "compraAccesorios"];

  useEffect(() => {
    if (token) {
      fetchObras();
    }
  }, [token, API_URL]);

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

  const fetchEventos = async () => {
    if (!token) return;
    setLoading(true);
    setErrorMsg("");
    let url = `${API_URL}/api/calendario`;
    const params = [];
    if (obraId) params.push(`obraId=${obraId}`);
    if (actividad) params.push(`actividad=${actividad}`);
    if (params.length > 0) {
      url += "?" + params.join("&");
    }
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
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Opcional: Puedes re-ejecutar fetchEventos manualmente con el botón "Buscar"
  useEffect(() => {
    fetchEventos();
  }, [obraId, actividad, token]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Calendario</h1>
        <div className={styles.filters}>
          <select value={obraId} onChange={(e) => setObraId(e.target.value)}>
            <option value="">Todas las Obras</option>
            {obras.map((o) => (
              <option key={o._id} value={o._id}>
                {o.nombre}
              </option>
            ))}
          </select>
          <select value={actividad} onChange={(e) => setActividad(e.target.value)}>
            <option value="">Todas las Actividades</option>
            {actividadesPosibles.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
          <Button onClick={fetchEventos}>Buscar</Button>
        </div>
      </div>

      {loading && <div className={styles.spinner}>Cargando eventos...</div>}
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {!loading && eventos.length === 0 && !errorMsg && (
        <div className={styles.noEvents}>No hay eventos para mostrar</div>
      )}
      {!loading && eventos.length > 0 && (
        <div className={styles.calendarWrapper}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={eventos}
          />
        </div>
      )}
    </div>
  );
};

export default Calendario;
