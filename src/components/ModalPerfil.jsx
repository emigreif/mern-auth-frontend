// src/components/ModalPerfil.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "./Button.jsx";
import styles from "../styles/modals/GlobalModal.module.css";

export default function ModalPerfil({ isOpen, onClose, perfilData = {}, onSave }) {
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    largo: 0,
    pesoxmetro: 0,
    cantidad: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (perfilData) {
      setFormData(perfilData);
    }
  }, [perfilData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!formData.codigo) err.codigo = "Código requerido";
    if (!formData.descripcion) err.descripcion = "Descripción requerida";
    if (formData.cantidad < 0) err.cantidad = "Cantidad no puede ser negativa";
    if (formData.largo < 0) err.largo = "Largo no puede ser negativo";
    if (formData.pesoxmetro < 0) err.pesoxmetro = "Peso x metro inválido";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Perfil OV">
      <form onSubmit={handleSave} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label>Código</label>
          <input type="text" name="codigo" value={formData.codigo || ""} onChange={handleChange} />
          {errors.codigo && <small className={styles.error}>{errors.codigo}</small>}
        </div>
        <div className={styles.formGroup}>
          <label>Descripción</label>
          <input type="text" name="descripcion" value={formData.descripcion || ""} onChange={handleChange} />
          {errors.descripcion && <small className={styles.error}>{errors.descripcion}</small>}
        </div>
        <div className={styles.formGroup}>
          <label>Color</label>
          <input type="text" name="color" value={formData.color || ""} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Largo</label>
          <input type="number" name="largo" value={formData.largo || 0} onChange={handleChange} />
          {errors.largo && <small className={styles.error}>{errors.largo}</small>}
        </div>
        <div className={styles.formGroup}>
          <label>Peso x metro</label>
          <input type="number" name="pesoxmetro" value={formData.pesoxmetro || 0} onChange={handleChange} />
          {errors.pesoxmetro && <small className={styles.error}>{errors.pesoxmetro}</small>}
        </div>
        <div className={styles.formGroup}>
          <label>Cantidad</label>
          <input type="number" name="cantidad" value={formData.cantidad || 0} onChange={handleChange} />
          {errors.cantidad && <small className={styles.error}>{errors.cantidad}</small>}
        </div>
        <div className={styles.actions}>
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
