// src/components/ModalUbicaciones.jsx
import React, { useState } from "react";
import styles from "../styles/modals/ModalUbicaciones.module.css";

/**
 * ModalUbicaciones: permite definir rangos de pisos y la cantidad de ubicaciones en cada uno
 * para luego generar masivamente en la base de datos.
 *
 * Props:
 *  - obra: objeto con { _id, nombre }
 *  - onClose: function => cierra el modal
 *  - (opcional) onGenerated: function => callback tras generar ubicaciones
 */
export default function ModalUbicaciones({ obra, onClose, onGenerated }) {
  const [pisos, setPisos] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  /**
   * Agrega un nuevo registro de piso con { rango: "", ubicaciones: 1 }
   */
  const handleAddPiso = () => {
    setPisos([...pisos, { rango: "", ubicaciones: 1 }]);
  };

  /**
   * Maneja cambios en el array de pisos
   * @param {number} index - índice del piso en el array
   * @param {string} field - "rango" o "ubicaciones"
   * @param {string|number} value - nuevo valor
   */
  const handleChangePiso = (index, field, value) => {
    const updated = [...pisos];
    updated[index][field] = value;
    setPisos(updated);
  };

  /**
   * Generar Ubicaciones en masa
   *  - Validar que la obra exista
   *  - Validar que haya al menos un piso
   *  - POST /api/ubicaciones/generar => { obraId, pisos: [{ rango, ubicaciones }, ...] }
   */
  const handleGenerate = async () => {
    setErrorMsg("");
    if (!obra || !obra._id) {
      setErrorMsg("No se recibió la obra.");
      return;
    }
    if (pisos.length === 0) {
      setErrorMsg("Debes agregar al menos un piso.");
      return;
    }
    for (let p of pisos) {
      if (!p.rango.trim()) {
        setErrorMsg("Cada rango de pisos es requerido.");
        return;
      }
      if (p.ubicaciones <= 0) {
        setErrorMsg("La cantidad de ubicaciones debe ser mayor a 0.");
        return;
      }
    }

    // Llamar al endpoint
    try {
      const res = await fetch(`/api/ubicaciones/generar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ obraId: obra._id, pisos })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al generar ubicaciones");
      }
      await res.json();
      if (onGenerated) onGenerated();
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  if (!obra) return null; // O maneja un fallback

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>
        <h2 className={styles.title}>
          Carga de Ubicaciones - Obra {obra.nombre}
        </h2>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <div className={styles.formContainer}>
          {pisos.map((p, i) => (
            <div key={i} className={styles.pisoItem}>
              <input
                type="text"
                placeholder="Rango de pisos (ej: 1-3, 5, 7-9)"
                value={p.rango}
                onChange={(e) => handleChangePiso(i, "rango", e.target.value)}
              />
              <input
                type="number"
                placeholder="Cant. Ubicaciones"
                value={p.ubicaciones}
                onChange={(e) => handleChangePiso(i, "ubicaciones", parseInt(e.target.value) || 0)}
                style={{ width: "120px" }}
              />
            </div>
          ))}
        </div>

        <button onClick={handleAddPiso}>+ Agregar Piso</button>
        <div className={styles.actions}>
          <button onClick={handleGenerate}>Generar Ubicaciones</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
