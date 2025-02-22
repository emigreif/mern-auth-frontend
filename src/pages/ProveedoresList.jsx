import React from 'react';
import '../styles/Proveedores.css';

const ProveedoresList = () => {
  return (
    <div className="proveedores-background">
      <div className="proveedores-container">
        <h1>Listado de Proveedores</h1>
        <p>Aquí podrás ver, filtrar y crear proveedores.</p>
        <ul className="proveedores-list">
          <li>Proveedor #1 (Nombre, Datos de contacto...)</li>
          <li>Proveedor #2 (Nombre, Datos de contacto...)</li>
          <li>Proveedor #3 ...</li>
        </ul>
      </div>
    </div>
  );
};

export default ProveedoresList;
