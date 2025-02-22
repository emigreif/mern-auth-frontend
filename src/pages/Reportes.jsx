// frontend/src/pages/Reportes/Reportes.jsx
import React from 'react';
import '../styles/Reportes.css';

const Reportes = () => {
  return (
    <div className="reportes-background">
      <div className="reportes-container">
        <h1>Reportes</h1>
        <p>Balance de obra, consumos vs. ingresos, tiempos de producción, etc.</p>
        <ul>
          <li>Balance de Obra (costos vs. ingresos)</li>
          <li>Consumos de stock</li>
          <li>Tiempos de producción</li>
          <li>Paradas o retrasos</li>
        </ul>
      </div>
    </div>
  );
};

export default Reportes;
