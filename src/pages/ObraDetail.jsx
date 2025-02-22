import React from 'react';
import './Obras.css';

const ObraDetail = () => {
  return (
    <div className="obras-background">
      <div className="obras-container">
        <h1>Detalle de Obra</h1>
        <p>Datos Generales (cliente, fechas, estado…).</p>
        <p>Presupuesto: tipologías, totales, etc.</p>
        <p>Compras, Producción, Logística, Finanzas...</p>

        {/* Podrías usar pestañas con React Router o un estado local */}
      </div>
    </div>
  );
};

export default ObraDetail;
