// src/components/ModalPerfil.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx"; // Tu componente modal base

/**
 * ModalPerfil: un modal para ver/editar un “perfil” (o "profile") de algo en Pañol
 * Props:
 * - isOpen (bool): si el modal está abierto
 * - onClose (func): cierra el modal
 * - perfilData (obj): datos iniciales del perfil a editar
 * - onSave (func): callback para guardar cambios
 */
export default function ModalPerfil({ 
  isOpen, 
  onClose, 
  perfilData = {}, 
  onSave 
}) {
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 0,
    // ... cualquier otro campo
  });

  // Cargar datos iniciales cuando se abra
  useEffect(() => {
    if (perfilData) {
      setFormData(perfilData);
    }
  }, [perfilData]);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar
  const handleSave = (e) => {
    e.preventDefault();
    // Llamamos a la función que nos pase el padre
    onSave(formData);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Perfil en Pañol">
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Código</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={formData.color || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad || 0}
            onChange={handleChange}
          />
        </div>

        {/* Agrega más campos si lo deseas */}

        <div className="form-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
