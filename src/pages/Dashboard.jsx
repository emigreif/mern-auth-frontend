// frontend/src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-background">
      <div className="dashboard-container">
        <h1>Dashboard (Panel General)</h1>
        <p>
          Aquí se mostrarán las obras/presupuestos aprobados con tarjetas/renglones 
          que incluyan N° de Obra, Nombre, Cliente, Fechas, Semáforos de estado, etc.
        </p>
        <p>
          También habrá accesos rápidos a filtros (por estado, cliente, fecha).
          Usa tu imaginación para mostrar info relevante y mantener la estética.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
