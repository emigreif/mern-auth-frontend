import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase.jsx";
import styles from "../styles/modals/ModalAccesorio.module.css";

/**
 * Props esperadas:
 * - isOpen: boolean
 * - onClose: function
 * - accesorioData: objeto a editar o null
 * - onSave: function(data)
 */
export default function ModalAccesorio({
  isOpen,
  onClose,
  accesorioData = null,
  onSave
}) {
  const [form, setForm] = useState({
    descripcion: "",
    color: "",
    cantidad: 0,
    unidad: "u",
    tipo: "accesorios",
    observaciones: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (accesorioData) {
      setForm({
        descripcion: accesorioData.descripcion || "",
        color: accesorioData.color || "",
        cantidad: accesorioData.cantidad || 0,
        unidad: accesorioData.unidad || "u",
        tipo: accesorioData.tipo || "accesorios",
        observaciones: accesorioData.observaciones || ""
      });
    } else {
      setForm({
        descripcion: "",
        color: "",
        cantidad: 0,
        unidad: "u",
        tipo: "accesorios",
        observaciones: ""
      });
    }
  }, [accesorioData]);

  const validate = () => {
    const err = {};
    if (!form.descripcion.trim()) err.descripcion = "Descripción requerida";
    if (!form.tipo) err.tipo = "Tipo requerido";
    if (!form.unidad.trim()) err.unidad = "Unidad requerida";
    if (form.cantidad < 0) err.cantidad = "Cantidad inválida";

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
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={accesorioData ? "Editar Accesorio" : "Nuevo Accesorio"}
    >
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label>Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />
          {errors.descripcion && <small className={styles.error}>{errors.descripcion}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="accesorios">Accesorio</option>
            <option value="herrajes">Herraje</option>
            <option value="tornillos">Tornillos</option>
            <option value="bulones">Bulones</option>
            <option value="felpas">Felpas</option>
            <option value="selladores / espuma">Selladores / Espuma</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipo && <small className={styles.error}>{errors.tipo}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={form.color}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={form.cantidad}
            onChange={handleChange}
          />
          {errors.cantidad && <small className={styles.error}>{errors.cantidad}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Unidad</label>
          <input
            type="text"
            name="unidad"
            value={form.unidad}
            onChange={handleChange}
          />
          {errors.unidad && <small className={styles.error}>{errors.unidad}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={form.observaciones}
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
