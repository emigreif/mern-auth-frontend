// src/components/ModalReporteMedicion.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ModalReporteMedicion({ obra, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [ubicacionesMedidas, setUbicacionesMedidas] = useState([]);
  const [tipologiasResumen, setTipologiasResumen] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Evita fetch si no hay obra._id
    if (!obra || !obra._id) return;

    const fetchReporte = async () => {
      try {
        setErrorMsg("");
        // GET /api/mediciones/reporte?obraId=...
        const res = await fetch(
          `${API_URL}/api/mediciones/reporte/obra/${obra._id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (!res.ok) {
          const dataErr = await res.json();
          throw new Error(dataErr.message || "Error al obtener reporte de medición");
        }
        const data = await res.json();

        // Suponiendo data = { obraId, mediciones: [...], tipologias: [...] } 
        // Ajusta si tu backend retorna otra estructura
        // Por ejemplo, data.ubicaciones, data.tipologias, etc.
        // En este ejemplo, asumimos:
        //   data.mediciones => array de ubicaciones con anchoMedido, altoMedido, ...
        //   data.tipologias => array con resumen

        if (data.mediciones) {
          setUbicacionesMedidas(data.mediciones);
        }
        if (data.tipologias) {
          setTipologiasResumen(data.tipologias);
        }
      } catch (error) {
        setErrorMsg(error.message);
      }
    };

    fetchReporte();
  }, [obra, token]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Reporte de Medición - {obra?.nombre || ""}</h2>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <h3>1) Ubicaciones con Medidas</h3>
        {ubicacionesMedidas.length === 0 && (
          <p>No hay ubicaciones medidas registradas.</p>
        )}
        {ubicacionesMedidas.map((u) => (
          <div key={u._id} style={{ marginBottom: "1rem" }}>
            <p>
              <strong>
                {u.piso}
                {u.ubicacion} - {u.tipologia?.codigo}
              </strong>
              <br />
              Medido: {u.anchoMedido} x {u.altoMedido}
              <br />
              Observaciones: {u.observaciones}
            </p>
          </div>
        ))}

        <h3>2) Tipologías con Ubicaciones</h3>
        {tipologiasResumen.length === 0 && (
          <p>No hay resumen de tipologías.</p>
        )}
        {tipologiasResumen.map((t) => (
          <div key={t.tipologiaId} style={{ marginBottom: "1rem" }}>
            <h4>
              {t.codigo} - {t.descripcion}
            </h4>
            {t.ubicaciones.map((u) => (
              <p key={u.ubicacionId}>
                {u.piso}
                {u.ubicacion}: {u.anchoMedido} x {u.altoMedido}
              </p>
            ))}
          </div>
        ))}

        <button onClick={onClose} style={{ marginTop: "1rem" }}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
