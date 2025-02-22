
import React from 'react';
import '../styles/Calendario.css';

const Calendario = () => {
  return (
    <div className="calendario-background">
      <div className="calendario-container">
        <h1>Calendario (Vista Gantt o similar)</h1>
        <p>Aquí verás las fechas clave de producción, montaje, etc. con asignación de equipos.</p>
        <p>Puedes usar librerías como react-big-calendar, fullcalendar, etc. o crear un Gantt propio.</p>
      </div>
    </div>
  );
};

export default Calendario;
