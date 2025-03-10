// src/pages/Clientes.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";

const Clientes = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({
    tipoCliente: "particular",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: { calle: "", ciudad: "" },
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/clientes`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener clientes");
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClientes();
  }, [API_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("direccion.")) {
      // Manejo de subcampos de dirección
      const subfield = name.split(".")[1];
      setNuevoCliente({
        ...nuevoCliente,
        direccion: { ...nuevoCliente.direccion, [subfield]: value },
      });
    } else {
      setNuevoCliente({ ...nuevoCliente, [name]: value });
    }
  };

  const handleCreateCliente = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente),
      });
      if (!res.ok) throw new Error("Error al crear cliente");
      const data = await res.json();
      setClientes([...clientes, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Clientes</h1>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Agregar Cliente
        </button>

        <div className="list">
          {clientes.map((c) => (
            <div key={c._id} className="list-item">
              <h2>
                {c.nombre} {c.apellido}
              </h2>
              <p>
                <strong>Email:</strong> {c.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {c.telefono}
              </p>
              <p>
                <strong>Dirección:</strong> {c.direccion?.calle},{" "}
                {c.direccion?.ciudad}
              </p>
            </div>
          ))}
        </div>

        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Cliente"
        >
          <form onSubmit={handleCreateCliente}>
            <div className="form-group">
              <label>Tipo de Cliente</label>
              <select name="tipoCliente" onChange={handleInputChange}>
                <option value="particular">Particular</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input type="text" name="telefono" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Dirección - Calle</label>
              <input
                type="text"
                name="direccion.calle"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Dirección - Ciudad</label>
              <input
                type="text"
                name="direccion.ciudad"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn">
                Guardar
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </ModalBase>
      </div>
    </div>
  );
};

export default Clientes;
