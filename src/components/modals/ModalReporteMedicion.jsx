// src/components/modals/modalReporteMedicion.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

export default function ModalReporteMedicion({ obra, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [ubicacionesMedidas, setUbicacionesMedidas] = useState([]);
  const [tipologiasResumen, setTipologiasResumen] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!obra || !obra._id) return;

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
  }, [obra, token, API_URL]);

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Reporte de Medición - ${obra?.nombre || ""}`}>
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <section>
        <h3>1) Ubicaciones con Medidas</h3>
        {ubicacionesMedidas.length === 0 ? (
          <p>No hay ubicaciones medidas registradas.</p>
        ) : (
          ubicacionesMedidas.map((u) => (
            <div key={u._id} className={styles.reportItem}>
              <p>
                <strong>
                  {u.piso}{u.ubicacion} - {u.tipologia?.codigo}
                </strong>
              </p>
              <p>Medido: {u.anchoMedido} x {u.altoMedido}</p>
              <p>Observaciones: {u.observaciones}</p>
            </div>
          ))
        )}
      </section>

      <section>
        <h3>2) Tipologías con Ubicaciones</h3>
        {tipologiasResumen.length === 0 ? (
          <p>No hay resumen de tipologías.</p>
        ) : (
          tipologiasResumen.map((t) => (
            <div key={t.tipologiaId} className={styles.reportItem}>
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

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </div>
    </ModalBase>
  );
}
