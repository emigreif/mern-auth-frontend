import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ClienteModal = ({ isOpen, onClose, onClienteCreado }) => {
  const [nuevoCliente, setNuevoCliente] = useState({
    tipoCliente: "particular",
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
    direccion: { calle: "", ciudad: "" },
    notas: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoCliente({ ...nuevoCliente, [name]: value });
  };

  const handleSaveCliente = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(nuevoCliente),
      });

      if (!res.ok) throw new Error("Error al crear cliente");

      const data = await res.json();
      onClienteCreado(data.cliente);
      onClose();
    } catch (error) {
      console.error("Error creando cliente:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Nuevo Cliente</h2>
        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} />
        <button onClick={handleSaveCliente}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ClienteModal;
