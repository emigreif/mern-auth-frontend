// src/components/ModalHerramienta/ModalHerramienta.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../ModalBase/ModalBase.jsx";
import styles from "./ModalHerramienta.module.css";

/**
 * Props:
 *  - isOpen: bool
 *  - onClose: func
 *  - onSave: func => crea/edita
 *  - herramientaData: objeto con datos de la herramienta (o null)
 */
export default function ModalHerramienta({ isOpen, onClose, onSave, herramientaData = null }) {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    descripcion: "",
    numeroSerie: "",
    estado: "en stock"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (herramientaData) {
      setFormData({
        marca: herramientaData.marca || "",
        modelo: herramientaData.modelo || "",
        descripcion: herramientaData.descripcion || "",
        numeroSerie: herramientaData.numeroSerie || "",
        estado: herramientaData.estado || "en stock"
      });
    } else {
      setFormData({
        marca: "",
        modelo: "",
        descripcion: "",
        numeroSerie: "",
        estado: "en stock"
      });
    }
  }, [herramientaData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.marca.trim()) newErrors.marca = "La marca es requerida.";
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es requerido.";
    // descripcion y numeroSerie => no requeridos, pero si quieres, validalo
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Nueva Herramienta">
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {errors.global && <p className={styles.error}>{errors.global}</p>}

        <div className={styles.formGroup}>
          <label>Marca (requerido)</label>
          <input
            type="text"
            name="marca"
            value={formData.marca}
            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
          />
          {errors.marca && <small className={styles.error}>{errors.marca}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Modelo (requerido)</label>
          <input
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
          />
          {errors.modelo && <small className={styles.error}>{errors.modelo}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>N° Serie</label>
          <input
            type="text"
            name="numeroSerie"
            value={formData.numeroSerie}
            onChange={(e) =>
              setFormData({ ...formData, numeroSerie: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          >
            <option value="en stock">En Stock</option>
            <option value="en obra">En Obra</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button type="submit">
            {herramientaData ? "Actualizar" : "Guardar"}
          </button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </ModalBase>
  );
}
