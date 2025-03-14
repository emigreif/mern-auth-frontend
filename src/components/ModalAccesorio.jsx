// frontend/src/components/ModalAccesorio.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx"; // Tu modal genérico
import "../styles/ModalBase.css";       // Ajusta la ruta si es necesario

/**
 * Props esperadas:
 * - isOpen: boolean => si el modal está abierto
 * - onClose: function => cierra el modal
 * - onSave: function => se llama al guardar (crear/editar)
 * - accesorioData: objeto con datos del accesorio a editar (o null para crear)
 */
export default function ModalAccesorio({
  isOpen,
  onClose,
  onSave,
  accesorioData = null
}) {
  // Estado local para manejar los campos del accesorio
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 0,
    unidad: "u",        // unidad de medida, ej: 'u', 'kg', etc.
    observaciones: ""
  });

  // Cargar datos al montar (para editar)
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
      // Crear nuevo => limpiar
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
    <ModalBase isOpen={isOpen} onClose={onClose} title="Accesorio en Pañol">
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

        {/* Color */}
        <div className="form-group">
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
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

        {/* Unidad */}
        <div className="form-group">
          <label>Unidad</label>
          <input
            type="text"
            name="unidad"
            value={formData.unidad}
            onChange={handleChange}
          />
        </div>

        {/* Observaciones */}
        <div className="form-group">
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
          />
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button type="submit">
            {accesorioData ? "Actualizar" : "Guardar"}
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
