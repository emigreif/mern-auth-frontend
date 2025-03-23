// src/components/ModalAccesorio.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx"; // Tu modal genérico
import styles from "../styles/modals/ModalAccesorio.module.css";

/**
 * Props:
 *  - isOpen: bool => si el modal está abierto
 *  - onClose: func => cierra el modal
 *  - onSave: func => se llama al guardar
 *  - accesorioData: objeto con datos del accesorio a editar (o null)
 */
export default function ModalAccesorio({
  isOpen,
  onClose,
  onSave,
  accesorioData = null
}) {
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 0,
    unidad: "u",
    observaciones: ""
  });

  // Validaciones de campos requeridos
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (accesorioData) {
      setFormData({
        codigo: accesorioData.codigo || "",
        descripcion: accesorioData.descripcion || "",
        color: accesorioData.color || "",
        cantidad: accesorioData.cantidad || 0,
        unidad: accesorioData.unidad || "u",
        observaciones: accesorioData.observaciones || ""
      });
    } else {
      setFormData({
        codigo: "",
        descripcion: "",
        color: "",
        cantidad: 0,
        unidad: "u",
        observaciones: ""
      });
    }
  }, [accesorioData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.codigo.trim()) newErrors.codigo = "El código es requerido";
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }
    // color no es required => optional
    if (formData.cantidad < 0) {
      newErrors.cantidad = "La cantidad no puede ser negativa";
    }
    // unidad y observaciones => optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(formData); // Llamamos a la función que guarda en la DB
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Accesorio en Pañol">
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label>Código (requerido)</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
          />
          {errors.codigo && <small style={{ color: "red" }}>{errors.codigo}</small>}
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
            <small style={{ color: "red" }}>{errors.descripcion}</small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
          />
          {errors.cantidad && (
            <small style={{ color: "red" }}>{errors.cantidad}</small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Unidad</label>
          <input
            type="text"
            name="unidad"
            value={formData.unidad}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
          />
        </div>

        <div className={styles.actions}>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
