import React, { useState, useEffect } from "react";

export default function ModalHerramienta({ herramienta, onClose, onSaved }) {
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    descripcion: "",
    numeroSerie: "",
    estado: "en taller",
  });

  useEffect(() => {
    if (herramienta) setForm(herramienta);
  }, [herramienta]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica para guardar datos aquí
    onSaved();
  };

  return (
    <div className="modal">
      <h2>{herramienta ? "Editar Herramienta" : "Nueva Herramienta"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="marca" value={form.marca} onChange={handleChange} placeholder="Marca" required />
        <input type="text" name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo" required />
        <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" required />
        <input type="text" name="numeroSerie" value={form.numeroSerie} onChange={handleChange} placeholder="Número de Serie" required />
        <select name="estado" value={form.estado} onChange={handleChange}>
          <option value="en taller">En Taller</option>
          <option value="en obra">En Obra</option>
          <option value="en reparación">En Reparación</option>
        </select>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}
