// src/components/ModalPerfil.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import styles from "../styles/modals/ModalPerfil.module.css";

/**
 * ModalPerfil: para ver/editar un “perfil” de algo en Pañol
 * Props:
 *  - isOpen: bool
 *  - onClose: func
 *  - perfilData: obj => datos iniciales
 *  - onSave: func => guardar
 */
export default function ModalPerfil({
  isOpen,
  onClose,
  perfilData = {},
  onSave
}) {
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 0
  });

  useEffect(() => {
    if (perfilData) {
      setFormData(perfilData);
    }
  }, [perfilData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Valida si hay required
    // ...
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Perfil en Pañol">
      <form onSubmit={handleSave} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label>Código</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={formData.color || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad || 0}
            onChange={handleChange}
          />
        </div>

        <div className={styles.actions}>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </ModalBase>
  );
}
