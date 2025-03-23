// src/components/ModalPlanillaMedicion/ModalPlanillaMedicion.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/modals/ModalPlanillaMedicion.module.css";

export default function ModalPlanillaMedicion({ obra, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 1. Al montar, cargar mediciones existentes si hay una obra válida
  useEffect(() => {
    if (!obra || !obra._id) return;

    const fetchMediciones = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const res = await fetch(
          `${API_URL}/api/mediciones?obraId=${obra._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (!res.ok) {
          const dataErr = await res.json();
          throw new Error(dataErr.message || "Error al obtener mediciones");
        }
        const data = await res.json();
        // data es un array de mediciones => setDatos(data)
        setDatos(data);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMediciones();
  }, [obra, token, API_URL]);

  // 2. Manejar cambios en inputs
  const handleChange = (index, field, value) => {
    const updated = [...datos];
    updated[index][field] = value;
    setDatos(updated);
  };

  // 3. Guardar mediciones => POST /api/mediciones/masivo => { obraId, mediciones }
  const handleGuardar = async () => {
    if (!obra || !obra._id) {
      setErrorMsg("No se puede guardar: no hay información de la obra.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const body = {
        obraId: obra._id,
        mediciones: datos
      };

      const res = await fetch(`${API_URL}/api/mediciones/masivo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al guardar mediciones");
      }
      await res.json();
      setSuccessMsg("Mediciones guardadas correctamente");
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Render del modal
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Planilla de Medición - {obra?.nombre || ""}</h2>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        {successMsg && <p className={styles.success}>{successMsg}</p>}
        {loading && <p className={styles.spinner}>Cargando...</p>}

        {!loading && datos.map((d, i) => (
          <div
            key={d._id || i}
            style={{ border: "1px solid #ccc", marginBottom: "0.5rem", padding: "0.5rem" }}
          >
            <p>
              <strong>
                {d.piso}
                {d.ubicacion}
              </strong>
              {" - "}
              {d.tipologia?.codigo} (
              {d.tipologia?.ancho}x{d.tipologia?.alto})
            </p>
            <label>Ancho Medido:</label>
            <input
              type="number"
              value={d.anchoMedido || ""}
              onChange={(e) => handleChange(i, "anchoMedido", parseFloat(e.target.value) || 0)}
            />
            <label>Alto Medido:</label>
            <input
              type="number"
              value={d.altoMedido || ""}
              onChange={(e) => handleChange(i, "altoMedido", parseFloat(e.target.value) || 0)}
            />
            <label>Observaciones:</label>
            <input
              type="text"
              value={d.observaciones || ""}
              onChange={(e) => handleChange(i, "observaciones", e.target.value)}
            />
          </div>
        ))}

        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleGuardar}>Guardar</button>
          <button onClick={onClose} style={{ marginLeft: "0.5rem" }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
