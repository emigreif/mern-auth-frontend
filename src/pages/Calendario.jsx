import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarioProduccion = () => {
  const [eventos, setEventos] = useState([]);
  const [obraSeleccionada, setObraSeleccionada] = useState("");
  const [actividadSeleccionada, setActividadSeleccionada] = useState("");

  useEffect(() => {
    const cargarCalendario = async () => {
      try {
        let url = "http://localhost:5000/api/calendario";
        if (obraSeleccionada) url += `?obraId=${obraSeleccionada}`;
        if (actividadSeleccionada)
          url += `${
            obraSeleccionada ? "&" : "?"
          }actividad=${actividadSeleccionada}`;

        const res = await fetch(url);
        const data = await res.json();
        setEventos(data);
      } catch (error) {
        console.error("Error cargando calendario:", error);
      }
    };
    cargarCalendario();
  }, [obraSeleccionada, actividadSeleccionada]);

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Calendario de Producción</h1>

        <label>Filtrar por Obra:</label>
        <select onChange={(e) => setObraSeleccionada(e.target.value)}>
          <option value="">Todas</option>
          <option value="obra1">Obra 1</option>
          <option value="obra2">Obra 2</option>
        </select>

        <label>Filtrar por Actividad:</label>
        <select onChange={(e) => setActividadSeleccionada(e.target.value)}>
          <option value="">Todas</option>
          <option value="medicion">Medición</option>
          <option value="compraVidrios">Compra Vidrios</option>
          <option value="compraPerfiles">Compra Perfiles</option>
          <option value="inicioProduccion">Inicio Producción</option>
          <option value="montaje">Montaje</option>
        </select>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={eventos}
        />
      </div>
    </div>
  );
};

export default CalendarioProduccion;
