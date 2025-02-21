// frontend/src/pages/Admin/Admin.jsx
import React from 'react';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-background">
      <div className="admin-container">
        <h1>Administración / Configuración</h1>
        <p>
          Aquí manejarás usuarios/roles, parámetros globales (CAC, dólar, márgenes, etc.).
        </p>
        <ul>
          <li>Gestión de usuarios (agregar, editar, roles)</li>
          <li>Parámetros globales (actualizar valores, impuestos…)</li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;
