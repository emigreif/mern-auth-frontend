// frontend/src/components/ModalHerramienta.jsx
import React, { useState } from "react";

export default function ModalHerramienta({ onClose }) {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    descripcion: "",
    numeroSerie: "",
    estado: "en stock", // "en stock", "en obra", etc.
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // POST /api/panol/herramientas
    // body: formData
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Nueva Herramienta</h2>
        <label>Marca</label>
        <input
          type="text"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
        />
        <label>Modelo</label>
        <input
          type="text"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
        />
        <label>Descripción</label>
        <input
          type="text"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />
        <label>N° Serie</label>
        <input
          type="text"
          name="numeroSerie"
          value={formData.numeroSerie}
          onChange={handleChange}
        />
        <label>Estado</label>
        <select name="estado" value={formData.estado} onChange={handleChange}>
          <option value="en stock">En Stock</option>
          <option value="en obra">En Obra</option>
          <option value="baja">Baja</option>
        </select>
        <br />
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
