// src/components/ModalVidrio/ModalVidrio.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../ModalBase/ModalBase.jsx";
import styles from "./ModalVidrio.module.css";

/**
 * Props:
 *  - isOpen: bool
 *  - onClose: func
 *  - onSave: func
 *  - vidrioData: objeto con datos del vidrio a editar (o null)
 */
export default function ModalVidrio({
  isOpen,
  onClose,
  onSave,
  vidrioData = null
}) {
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    tipo: "VS", // "VS", "DVH", "TVH", etc.
    ancho: 0,
    alto: 0,
    cantidad: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vidrioData) {
      setFormData({
        codigo: vidrioData.codigo || "",
        descripcion: vidrioData.descripcion || "",
        tipo: vidrioData.tipo || "VS",
        ancho: vidrioData.ancho || 0,
        alto: vidrioData.alto || 0,
        cantidad: vidrioData.cantidad || 0
      });
    } else {
      setFormData({
        codigo: "",
        descripcion: "",
        tipo: "VS",
        ancho: 0,
        alto: 0,
        cantidad: 0
      });
    }
  }, [vidrioData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.codigo.trim()) newErrors.codigo = "El código es requerido.";
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida.";
    }
    if (formData.ancho < 0) newErrors.ancho = "El ancho no puede ser negativo.";
    if (formData.alto < 0) newErrors.alto = "El alto no puede ser negativo.";
    if (formData.cantidad < 0) {
      newErrors.cantidad = "La cantidad no puede ser negativa.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Vidrio en Pañol">
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {errors.global && <p className={styles.error}>{errors.global}</p>}

        <div className={styles.formGroup}>
          <label>Código (requerido)</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
          />
          {errors.codigo && <small className={styles.error}>{errors.codigo}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Descripción (requerida)</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
          {errors.descripcion && (
            <small className={styles.error}>{errors.descripcion}</small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Tipo de Vidrio</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange}>
            <option value="VS">VS (Simple)</option>
            <option value="DVH">DVH (Doble)</option>
            <option value="TVH">TVH (Triple)</option>
            <option value="laminado">Laminado</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Ancho (mm)</label>
          <input
            type="number"
            name="ancho"
            value={formData.ancho}
            onChange={handleChange}
            min={0}
          />
          {errors.ancho && <small className={styles.error}>{errors.ancho}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Alto (mm)</label>
          <input
            type="number"
            name="alto"
            value={formData.alto}
            onChange={handleChange}
            min={0}
          />
          {errors.alto && <small className={styles.error}>{errors.alto}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min={0}
          />
          {errors.cantidad && (
            <small className={styles.error}>{errors.cantidad}</small>
          )}
        </div>

        <div className={styles.actions}>
          <button type="submit">
            {vidrioData ? "Actualizar" : "Guardar"}
          </button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </ModalBase>
  );
}
