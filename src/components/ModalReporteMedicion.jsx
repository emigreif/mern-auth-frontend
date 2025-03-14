// frontend/src/components/ModalReporteMedicion.jsx
import React, { useEffect, useState } from "react";

export default function ModalReporteMedicion({ obra, onClose }) {
  const [ubicacionesMedidas, setUbicacionesMedidas] = useState([]);
  const [tipologiasResumen, setTipologiasResumen] = useState([]);

  useEffect(() => {
    // GET /api/mediciones/reporte?obraId=... 
    // -> { ubicaciones: [...], tipologias: [...] }
    // O construye manualmente
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Reporte de Medición - {obra.nombre}</h2>
        
        <h3>1) Ubicaciones con Medidas</h3>
        {ubicacionesMedidas.map((u) => (
          <div key={u._id}>
            <p>
              {u.piso}{u.ubicacion} - {u.tipologia?.codigo} <br />
              Medido: {u.anchoMedido} x {u.altoMedido} <br />
              Observaciones: {u.observaciones}
            </p>
          </div>
        ))}

        <h3>2) Tipologías con Ubicaciones</h3>
        {tipologiasResumen.map((t) => (
          <div key={t.tipologiaId}>
            <h4>{t.codigo} - {t.descripcion}</h4>
            {t.ubicaciones.map((u) => (
              <p key={u.ubicacionId}>
                {u.piso}{u.ubicacion}: {u.anchoMedido} x {u.altoMedido}
              </p>
            ))}
          </div>
        ))}

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
