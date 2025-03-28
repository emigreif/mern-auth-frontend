// src/components/modals/modalIngresoMaterial.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "./Button.jsx";
import styles from "../styles/modals/GlobalModal.module.css";

export default function ModalIngresoMaterial({ compra, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Número de remito y lista de items a ingresar
  const [numeroRemito, setNumeroRemito] = useState("");
  const [items, setItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Maneja el cambio en la cantidad ingresada para cada ítem
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
      onSaved();
    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Ingreso de Material - OC #${compra.numeroOC}`}>
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

        <div className={styles.itemsList}>
          {compra.tipo === "aluminio" &&
            compra.pedido.map((p) => (
              <div key={p._id} className={styles.itemRow}>
                <span>{p.codigo} - {p.descripcion}</span>
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
                <span>{v.codigo} - {v.descripcion}</span>
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
                <span>{a.codigo} - {a.descripcion}</span>
                <input
                  type="number"
                  placeholder="Cantidad a ingresar"
                  onChange={(e) => handleChangeCantidad(a._id, e.target.value)}
                />
              </div>
            ))}
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
