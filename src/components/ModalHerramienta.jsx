import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import styles from "../styles/modals/ModalHerramienta.module.css";

/**
 * Props esperadas:
 * - isOpen: boolean
 * - onClose: func
 * - herramienta: objeto a editar o null
 * - onSave: func(data)
 */
export default function ModalHerramienta({
  isOpen,
  onClose,
  herramienta = null,
  onSave
}) {
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    descripcion: "",
    numeroSerie: "",
    estado: "en taller",
    obra: "",
    responsable: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (herramienta) {
      setForm({
        marca: herramienta.marca || "",
        modelo: herramienta.modelo || "",
        descripcion: herramienta.descripcion || "",
        numeroSerie: herramienta.numeroSerie || "",
        estado: herramienta.estado || "en taller",
        obra: herramienta.obra || "",
        responsable: herramienta.responsable || ""
      });
    } else {
      setForm({
        marca: "",
        modelo: "",
        descripcion: "",
        numeroSerie: "",
        estado: "en taller",
        obra: "",
        responsable: ""
      });
    }
  }, [herramienta]);

  const validate = () => {
    const err = {};
    if (!form.marca.trim()) err.marca = "Marca requerida";
    if (!form.modelo.trim()) err.modelo = "Modelo requerido";
    if (!form.descripcion.trim()) err.descripcion = "Descripción requerida";
    if (!form.numeroSerie.trim()) err.numeroSerie = "Número de serie requerido";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={herramienta ? "Editar Herramienta" : "Nueva Herramienta"}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label>Marca</label>
          <input type="text" name="marca" value={form.marca} onChange={handleChange} />
          {errors.marca && <small className={styles.error}>{errors.marca}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Modelo</label>
          <input type="text" name="modelo" value={form.modelo} onChange={handleChange} />
          {errors.modelo && <small className={styles.error}>{errors.modelo}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Descripción</label>
          <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} />
          {errors.descripcion && <small className={styles.error}>{errors.descripcion}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Número de Serie</label>
          <input type="text" name="numeroSerie" value={form.numeroSerie} onChange={handleChange} />
          {errors.numeroSerie && <small className={styles.error}>{errors.numeroSerie}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="en taller">En Taller</option>
            <option value="en obra">En Obra</option>
            <option value="en reparación">En Reparación</option>
          </select>
        </div>

        {/* Solo si va a obra pedimos obra y responsable */}
        {form.estado === "en obra" && (
          <>
            <div className={styles.formGroup}>
              <label>Obra</label>
              <input type="text" name="obra" value={form.obra} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Responsable</label>
              <input type="text" name="responsable" value={form.responsable} onChange={handleChange} />
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </ModalBase>
  );
}
