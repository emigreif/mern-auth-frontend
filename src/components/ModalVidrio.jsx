// frontend/src/components/ModalVidrio.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx"; // Tu modal genérico
import "../styles/ModalBase.css";       // Ajusta la ruta si es necesario

/**
 * Props esperadas:
 * - isOpen: boolean => si el modal está abierto
 * - onClose: function => cierra el modal
 * - onSave: function => se llama al guardar (crear/editar)
 * - vidrioData: objeto con datos del vidrio a editar (o null para crear)
 */
export default function ModalVidrio({
  isOpen,
  onClose,
  onSave,
  vidrioData = null
}) {
  // Estado local para manejar los campos del vidrio
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    tipo: "VS",     // VS, DVH, TVH, etc. Ajusta según tus necesidades
    ancho: 0,
    alto: 0,
    cantidad: 0
  });

  // Cargar datos al montar (para editar)
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
      // Crear nuevo => limpiar
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

  // Manejador de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar (llama a la función onSave del padre)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Vidrio en Pañol">
      <form onSubmit={handleSubmit} className="form-base">
        {/* Código */}
        <div className="form-group">
          <label>Código</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label>Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        {/* Tipo (VS, DVH, etc.) */}
        <div className="form-group">
          <label>Tipo de Vidrio</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange}>
            <option value="VS">VS (Simple)</option>
            <option value="DVH">DVH (Doble)</option>
            <option value="TVH">TVH (Triple)</option>
            {/* Agrega más opciones si lo deseas */}
          </select>
        </div>

        {/* Ancho */}
        <div className="form-group">
          <label>Ancho (mm)</label>
          <input
            type="number"
            name="ancho"
            value={formData.ancho}
            onChange={handleChange}
            min={0}
          />
        </div>

        {/* Alto */}
        <div className="form-group">
          <label>Alto (mm)</label>
          <input
            type="number"
            name="alto"
            value={formData.alto}
            onChange={handleChange}
            min={0}
          />
        </div>

        {/* Cantidad */}
        <div className="form-group">
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min={0}
          />
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button type="submit">
            {vidrioData ? "Actualizar" : "Guardar"}
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
