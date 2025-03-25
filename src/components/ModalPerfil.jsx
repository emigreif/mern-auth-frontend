import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase.jsx";
import styles from "../styles/modals/ModalPerfil.module.css";

/**
 * Props esperadas:
 * - isOpen: boolean
 * - onClose: function
 * - perfilData: objeto (si está editando) o null
 * - onSave: function(data)
 */
export default function ModalPerfil({
  isOpen,
  onClose,
  perfilData = null,
  onSave
}) {
  const [form, setForm] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 0,
    largo: 0,
    pesoxmetro: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (perfilData) {
      setForm({
        codigo: perfilData.codigo || "",
        descripcion: perfilData.descripcion || "",
        color: perfilData.color || "",
        cantidad: perfilData.cantidad || 0,
        largo: perfilData.largo || 0,
        pesoxmetro: perfilData.pesoxmetro || 0
      });
    } else {
      setForm({
        codigo: "",
        descripcion: "",
        color: "",
        cantidad: 0,
        largo: 0,
        pesoxmetro: 0
      });
    }
  }, [perfilData]);

  const validate = () => {
    const newErrors = {};
    if (!form.codigo.trim()) newErrors.codigo = "Código requerido";
    if (!form.descripcion.trim()) newErrors.descripcion = "Descripción requerida";
    if (form.cantidad < 0) newErrors.cantidad = "Cantidad inválida";
    if (form.largo <= 0) newErrors.largo = "Largo inválido";
    if (form.pesoxmetro <= 0) newErrors.pesoxmetro = "Peso inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    <ModalBase isOpen={isOpen} onClose={onClose} title={perfilData ? "Editar Perfil" : "Nuevo Perfil"}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label>Código</label>
          <input
            type="text"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
          />
          {errors.codigo && <small className={styles.error}>{errors.codigo}</small>}
        </div>

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
          <label>Largo (mm)</label>
          <input
            type="number"
            name="largo"
            value={form.largo}
            onChange={handleChange}
          />
          {errors.largo && <small className={styles.error}>{errors.largo}</small>}
        </div>

        <div className={styles.formGroup}>
          <label>Peso por metro (kg)</label>
          <input
            type="number"
            step="0.01"
            name="pesoxmetro"
            value={form.pesoxmetro}
            onChange={handleChange}
          />
          {errors.pesoxmetro && <small className={styles.error}>{errors.pesoxmetro}</small>}
        </div>

        <div className={styles.actions}>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </ModalBase>
  );
}
