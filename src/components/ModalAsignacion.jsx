// src/components/ModalAsignacion.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "./Button.jsx";
import styles from "../styles/modals/GlobalModal.module.css";

export default function ModalAsignacion({ obra, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [tipologias, setTipologias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!obra || !obra._id) return;
    fetchData();
  }, [obra]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // GET tipologías
      const resTips = await fetch(`${API_URL}/api/tipologias?obraId=${obra._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resTips.ok) {
        const errData = await resTips.json();
        throw new Error(errData.message || "Error al obtener tipologías");
      }
      const tipData = await resTips.json();

      // GET ubicaciones
      const resUb = await fetch(`${API_URL}/api/ubicaciones?obraId=${obra._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resUb.ok) {
        const errData = await resUb.json();
        throw new Error(errData.message || "Error al obtener ubicaciones");
      }
      const ubData = await resUb.json();

      setTipologias(tipData);
      setUbicaciones(ubData);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTip = (tip) => {
    setSelectedTip(tip);
  };

  const handleClickUbicacion = (u) => {
    if (!selectedTip) return;

    const ubIndex = ubicaciones.findIndex((x) => x._id === u._id);
    const updatedArr = [...ubicaciones];

    // Si la ubicación ya está asignada a la tipología seleccionada, quita la asignación
    if (u.tipologiaId === selectedTip._id) {
      updatedArr[ubIndex] = { ...u, tipologiaId: null };
      setUbicaciones(updatedArr);
    } 
    // Sino, asigna la tipología, si la ubicación está libre
    else if (!u.tipologiaId) {
      updatedArr[ubIndex] = { ...u, tipologiaId: selectedTip._id };
      setUbicaciones(updatedArr);
    }
  };

  const handleGuardar = async () => {
    if (!obra || !obra._id) {
      setErrorMsg("No hay información de la obra para guardar.");
      return;
    }
    try {
      setLoading(true);
      setErrorMsg("");

      const asignaciones = ubicaciones
        .filter((u) => u.tipologiaId)
        .map((u) => ({
          ubicacionId: u._id,
          tipologiaId: u.tipologiaId,
        }));

      const body = { obraId: obra._id, asignaciones };

      const res = await fetch(`${API_URL}/api/asociacion/asignar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar asignaciones");
      }

      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Asignación Tipologías ↔ Ubicaciones - ${obra?.nombre || ""}`}>
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <p className={styles.spinner}>Cargando...</p>}

      <div className={styles.flexRow}>
        {/* Columna Tipologías */}
        <div className={styles.column}>
          <h3>Tipologías</h3>
          {tipologias.map((t) => {
            const disponible = t.cantidad - (t.asignados || 0);
            return (
              <Button
                key={t._id}
                onClick={() => handleSelectTip(t)}
                className={selectedTip?._id === t._id ? styles.active : ""}
                style={{ width: "100%", marginBottom: "0.5rem", textAlign: "left" }}
              >
                {t.codigo} (disp={disponible})
              </Button>
            );
          })}
        </div>

        {/* Columna Ubicaciones */}
        <div className={styles.column}>
          <h3>Ubicaciones</h3>
          <div className={styles.flexWrap}>
            {ubicaciones.map((u) => (
              <Button
                key={u._id}
                onClick={() => handleClickUbicacion(u)}
                style={{ width: "80px", height: "40px" }}
              >
                {u.piso}{u.ubicacion}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.flexRowEnd}>
        <Button onClick={handleGuardar} disabled={loading}>
          Guardar Asignaciones
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cerrar
        </Button>
      </div>
    </ModalBase>
  );
}
