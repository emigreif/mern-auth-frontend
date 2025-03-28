// src/components/modals/modalHerramienta.jsx
import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

export default function ModalHerramienta({ isOpen, onClose, onSave, herramienta = null }) {
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    descripcion: "",
    numeroSerie: "",
    estado: "en taller"
  });

  useEffect(() => {
    if (herramienta) {
      setForm({
        marca: herramienta.marca || "",
        modelo: herramienta.modelo || "",
        descripcion: herramienta.descripcion || "",
        numeroSerie: herramienta.numeroSerie || "",
        estado: herramienta.estado || "en taller"
      });
    } else {
      setForm({
        marca: "",
        modelo: "",
        descripcion: "",
        numeroSerie: "",
        estado: "en taller"
      });
    }
  }, [herramienta]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={herramienta ? "Editar Herramienta" : "Nueva Herramienta"}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label>Marca</label>
          <input type="text" name="marca" value={form.marca} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Modelo</label>
          <input type="text" name="modelo" value={form.modelo} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Descripción</label>
          <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>N° Serie</label>
          <input type="text" name="numeroSerie" value={form.numeroSerie} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="en taller">En Taller</option>
            <option value="en obra">En Obra</option>
            <option value="en reparación">En Reparación</option>
          </select>
        </div>
        <div className={styles.actions}>
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>

      {/* Si existe historial, se muestra */}
      {herramienta?.historial && herramienta.historial.length > 0 && (
        <div className={styles.historialSection}>
          <h3>Historial de Movimientos</h3>
          <table className={styles.historialTable}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estado Anterior</th>
                <th>Estado Nuevo</th>
                <th>Obra</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {herramienta.historial
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .map((mov, i) => (
                  <tr key={i}>
                    <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                    <td>{mov.estadoAnterior || "-"}</td>
                    <td>{mov.estadoNuevo}</td>
                    <td>{mov.obra?.nombre || "-"}</td>
                    <td>{mov.responsable?.nombre ? `${mov.responsable.nombre} ${mov.responsable.apellido || ""}` : "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </ModalBase>
  );
}
