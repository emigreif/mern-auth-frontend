// frontend/src/components/ModalPlanillaMedicion.jsx
import React, { useState, useEffect } from "react";

export default function ModalPlanillaMedicion({ obra, onClose }) {
  const [datos, setDatos] = useState([]); 
  // cada item: { ubicacionId, piso, ubicacion, tipologia: { ancho, alto, ...}, anchoMedido, altoMedido, observaciones }

  useEffect(() => {
    // fetch /api/mediciones?obraId=... => o /api/ubicaciones?obraId=... y tipologia asignada
    // setDatos(...) con la info
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...datos];
    updated[index][field] = value;
    setDatos(updated);
  };

  const handleGuardar = () => {
    // POST /api/mediciones => { obraId, mediciones: [ ... ] }
    // O PATCH, etc.
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Planilla de Medición - {obra.nombre}</h2>
        {datos.map((d, i) => (
          <div key={d.ubicacionId} style={{ border: "1px solid #ccc", marginBottom: "0.5rem" }}>
            <p><strong>{d.piso}{d.ubicacion}</strong> - {d.tipologia?.codigo} ({d.tipologia?.ancho}x{d.tipologia?.alto})</p>
            <label>Ancho Medido:</label>
            <input
              type="number"
              value={d.anchoMedido || ""}
              onChange={(e) => handleChange(i, "anchoMedido", e.target.value)}
            />
            <label>Alto Medido:</label>
            <input
              type="number"
              value={d.altoMedido || ""}
              onChange={(e) => handleChange(i, "altoMedido", e.target.value)}
            />
            <label>Observaciones:</label>
            <input
              type="text"
              value={d.observaciones || ""}
              onChange={(e) => handleChange(i, "observaciones", e.target.value)}
            />
          </div>
        ))}

        <button onClick={handleGuardar}>Guardar</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
