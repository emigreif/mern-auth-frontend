// frontend/src/pages/Proveedores/ProveedorDetail.jsx
import React from 'react';
import './Proveedores.css';

const ProveedorDetail = () => {
  return (
    <div className="proveedores-background">
      <div className="proveedores-container">
        <h1>Detalle de Proveedor</h1>
        <p>Aquí podrás ver y editar la información del proveedor seleccionado.</p>
        <p>(Datos como CUIT, mail, teléfono, historial de Órdenes de Compra, etc.)</p>
      </div>
    </div>
  );
};

export default ProveedorDetail;
