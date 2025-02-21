import React from 'react';
import './Obras.css';

const ObrasList = () => {
  return (
    <div className="obras-background">
      <div className="obras-container">
        <h1>Lista de Obras</h1>
        <p>Aquí irán todas las obras con paginación, filtrado, etc.</p>

        {/* Ejemplo de tabla o tarjetas */}
        <div className="obras-list">
          {/* Mapea tus obras y muestra la info */}
          <div className="obra-item">Obra #1 - Cliente X - Estado: ...</div>
          <div className="obra-item">Obra #2 - Cliente Y - Estado: ...</div>
          {/* etc. */}
        </div>
      </div>
    </div>
  );
};

export default ObrasList;
