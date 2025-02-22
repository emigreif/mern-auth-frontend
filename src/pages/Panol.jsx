// frontend/src/pages/Panol/Panol.jsx
import React from 'react';
import './Panol.css';

const Panol = () => {
  return (
    <div className="panol-background">
      <div className="panol-container">
        <h1>Pañol (Herramientas y Maquinaria)</h1>
        <p>Aquí gestionarás stock de maquinaria, herramientas, salidas y devoluciones, etc.</p>
        <ul>
          <li>Alta de máquinas</li>
          <li>Salidas por obra</li>
          <li>Mantenimiento y revisiones</li>
        </ul>
      </div>
    </div>
  );
};

export default Panol;
