import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

export default function ModalReporteMedicion({ obra, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [ubicacionesMedidas, setUbicacionesMedidas] = useState([]);
  const [tipologiasResumen, setTipologiasResumen] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!obra?._id) return;

    const fetchReporte = async () => {
      try {
        setErrorMsg("");
        const res = await fetch(`${API_URL}/api/mediciones/reporte/obra/${obra._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al obtener reporte de medición");
        }
        const data = await res.json();
        setUbicacionesMedidas(data.mediciones || []);
        setTipologiasResumen(data.tipologias || []);
      } catch (error) {
        setErrorMsg(error.message);
      }
    };

    fetchReporte();
  }, [obra, token]);

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Reporte de Medición - ${obra?.nombre || ""}`}>
      {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>1) Ubicaciones con Medidas</h3>
        {ubicacionesMedidas.length === 0 ? (
          <p>No hay ubicaciones medidas registradas.</p>
        ) : (
          ubicacionesMedidas.map((u) => (
            <div key={u._id} style={{ marginBottom: "1rem" }}>
              <strong>{u.piso}{u.ubicacion} - {u.tipologia?.codigo}</strong>
              <p>Medido: {u.anchoMedido} x {u.altoMedido}</p>
              <p>Observaciones: {u.observaciones}</p>
            </div>
          ))
        )}
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>2) Tipologías con Ubicaciones</h3>
        {tipologiasResumen.length === 0 ? (
          <p>No hay resumen de tipologías.</p>
        ) : (
          tipologiasResumen.map((t) => (
            <div key={t.tipologiaId} style={{ marginBottom: "1rem" }}>
              <h4>{t.codigo} - {t.descripcion}</h4>
              {t.ubicaciones.map((u) => (
                <p key={u.ubicacionId}>
                  {u.piso}{u.ubicacion}: {u.anchoMedido} x {u.altoMedido}
                </p>
              ))}
            </div>
          ))
        )}
      </section>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </div>
    </ModalBase>
  );
}
