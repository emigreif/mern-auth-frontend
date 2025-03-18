// src/components/ModalIngresoMaterial/ModalIngresoMaterial.jsx

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./ModalIngresoMaterial.module.css";
import ModalBase from "../ModalBase/ModalBase.jsx";

/**
 * Props:
 *  - compra: la OC (objeto con _id, numeroOC, tipo, pedido/vidrios/accesorios)
 *  - onClose: cierra modal
 *  - onSaved: callback tras guardar
 */
export default function ModalIngresoMaterial({ compra, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Número de remito ingresado por el usuario
  const [numeroRemito, setNumeroRemito] = useState("");
  // Lista de items con la cantidad ingresada
  // Ej: [{ itemId: "abc123", cantidadIngresada: 10 }, ...]
  const [items, setItems] = useState([]);
  // Estados de error y loading
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Maneja cambios en la cantidad ingresada de un ítem
  const handleChangeCantidad = (itemId, val) => {
    const cantidad = parseFloat(val) || 0;
    setItems((prev) => {
      const existingIndex = prev.findIndex((x) => x.itemId === itemId);
      if (existingIndex >= 0) {
        const newArr = [...prev];
        newArr[existingIndex].cantidadIngresada = cantidad;
        return newArr;
      } else {
        return [...prev, { itemId, cantidadIngresada: cantidad }];
      }
    });
  };

  // Envía los datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/compras/ingreso/${compra._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ numeroRemito, items })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al ingresar material");
      }

      await res.json();
      setLoading(false);
      onSaved(); // Notifica al padre que se guardó correctamente
    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <ModalBase
      isOpen={true}
      onClose={onClose}
      title={`Ingreso de Material - OC #${compra.numeroOC}`}
    >
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        {loading && <p className={styles.loading}>Guardando...</p>}

        <div className={styles.remitoGroup}>
          <label>Número de Remito</label>
          <input
            type="text"
            value={numeroRemito}
            onChange={(e) => setNumeroRemito(e.target.value)}
          />
        </div>

        {/* Renderiza la lista de ítems según el tipo de compra */}
        <div className={styles.itemsList}>
          {compra.tipo === "aluminio" &&
            compra.pedido.map((p) => (
              <div key={p._id} className={styles.itemRow}>
                <span>
                  {p.codigo} - {p.descripcion}
                </span>
                <input
                  type="number"
                  placeholder="Cantidad a ingresar"
                  onChange={(e) => handleChangeCantidad(p._id, e.target.value)}
                />
              </div>
            ))}

          {compra.tipo === "vidrios" &&
            compra.vidrios.map((v) => (
              <div key={v._id} className={styles.itemRow}>
                <span>
                  {v.codigo} - {v.descripcion}
                </span>
                <input
                  type="number"
                  placeholder="Cantidad a ingresar"
                  onChange={(e) => handleChangeCantidad(v._id, e.target.value)}
                />
              </div>
            ))}

          {compra.tipo === "accesorios" &&
            compra.accesorios.map((a) => (
              <div key={a._id} className={styles.itemRow}>
                <span>
                  {a.codigo} - {a.descripcion}
                </span>
                <input
                  type="number"
                  placeholder="Cantidad a ingresar"
                  onChange={(e) => handleChangeCantidad(a._id, e.target.value)}
                />
              </div>
            ))}
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={loading}>
            Guardar
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
