// src/components/modals/modalPlanillaMedicion.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "./Button.jsx";
import styles from "../styles/modals/GlobalModal.module.css";

export default function ModalPlanillaMedicion({ obra, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 1. Cargar mediciones existentes si hay una obra válida
  useEffect(() => {
    if (!obra || !obra._id) return;
    fetchMediciones();
  }, [obra]);

  const fetchMediciones = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`${API_URL}/api/mediciones?obraId=${obra._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al obtener mediciones");
      }
      const data = await res.json();
      setDatos(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Manejar cambios en inputs de cada medición
  const handleChange = (index, field, value) => {
    const updated = [...datos];
    updated[index][field] = value;
    setDatos(updated);
  };

  // 3. Guardar mediciones de forma masiva
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

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Planilla de Medición - ${obra?.nombre || ""}`}>
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {successMsg && <p className={styles.success}>{successMsg}</p>}
      {loading && <p className={styles.spinner}>Cargando...</p>}
      
      {!loading && datos.map((d, i) => (
        <div key={d._id || i} className={styles.row}>
          <p>
            <strong>{d.piso}{d.ubicacion} - {d.tipologia?.codigo}</strong> {" - "}
            {d.tipologia?.ancho} x {d.tipologia?.alto}
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
      
      <div className={styles.actions}>
        <Button onClick={handleGuardar} disabled={loading}>
          Guardar
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cerrar
        </Button>
      </div>
    </ModalBase>
  );
}
