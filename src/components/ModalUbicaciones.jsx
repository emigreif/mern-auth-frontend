// src/components/ModalUbicaciones.jsx
import React, { useState } from "react";
import styles from "../styles/modals/ModalUbicaciones.module.css";
import ModalBase from "./ModalBase";
import { useAuth } from "../context/AuthContext";

/**
 * Modal para generar ubicaciones por piso y cantidad
 * @param {Object} obra - Obra actual ({ _id, nombre })
 * @param {Function} onClose - Cierra el modal
 * @param {Function} onGenerated - Callback luego de generar
 */
export default function ModalUbicaciones({ obra, onClose, onGenerated }) {
  const [pisos, setPisos] = useState([{ rango: "", ubicaciones: 1 }]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const { token } = useAuth();

  const handleAgregarPiso = () => {
    setPisos([...pisos, { rango: "", ubicaciones: 1 }]);
  };

  const handleChange = (i, campo, valor) => {
    const copia = [...pisos];
    copia[i][campo] = valor;
    setPisos(copia);
  };

  const handleGenerar = async () => {
    setMensaje("");
    setError("");

    if (!obra || !obra._id) {
      setError("Obra no definida");
      return;
    }

    for (let piso of pisos) {
      if (!piso.rango.trim()) {
        setError("Cada rango debe completarse");
        return;
      }
      if (piso.ubicaciones < 1) {
        setError("Ubicaciones debe ser mayor a 0");
        return;
      }
    }

    try {
      const res = await fetch(`/api/ubicaciones/generar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ obraId: obra._id, pisos })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al generar ubicaciones");
      }

      const data = await res.json();
      setMensaje(`Se generaron ${data.creadas} ubicaciones`);
      if (onGenerated) onGenerated();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Carga de ubicaciones - Obra: ${obra.nombre}`}>
      <div className={styles.contenedor}>
        <p>Agrega pisos con rango y cantidad de ubicaciones por piso.</p>

        {pisos.map((p, i) => (
          <div key={i} className={styles.fila}>
            <input
              type="text"
              placeholder="Ej: 1-3,5"
              value={p.rango}
              onChange={(e) => handleChange(i, "rango", e.target.value)}
            />
            <input
              type="number"
              placeholder="Ubicaciones"
              min={1}
              value={p.ubicaciones}
              onChange={(e) => handleChange(i, "ubicaciones", parseInt(e.target.value) || 1)}
            />
          </div>
        ))}

        <button className={styles.btnSecundario} onClick={handleAgregarPiso}>
          + Agregar Piso
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {mensaje && <p className={styles.success}>{mensaje}</p>}

        <div className={styles.botones}>
          <button onClick={handleGenerar}>Generar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </ModalBase>
  );
}
