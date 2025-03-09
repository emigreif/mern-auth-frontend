import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import TableBase from "../components/TableBase.jsx";
import FormBase from "../components/FormBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCliente, setNewCliente] = useState({ nombre: "", apellido: "", email: "", telefono: "" });
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/clientes`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Error al obtener clientes");
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error("Error fetching clientes:", error);
      }
    };

    if (user) {
      fetchClientes();
    }
  }, [API_URL, user]);

  const handleInputChange = (e) => {
    setNewCliente({ ...newCliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(newCliente),
      });
      if (!res.ok) throw new Error("Error al agregar cliente");
      const data = await res.json();
      setClientes([...clientes, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding cliente:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Clientes</h1>
        <button onClick={() => setIsModalOpen(true)}>Agregar Cliente</button>

        <TableBase
          headers={["Nombre", "Apellido", "Email", "Teléfono"]}
          data={clientes.map((c) => ({
            Nombre: c.nombre,
            Apellido: c.apellido,
            Email: c.email,
            Teléfono: c.telefono,
          }))}
        />

        <ModalBase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Agregar Cliente</h2>
          <FormBase onSubmit={handleSubmit}>
            <label>Nombre:</label>
            <input type="text" name="nombre" value={newCliente.nombre} onChange={handleInputChange} required />

            <label>Apellido:</label>
            <input type="text" name="apellido" value={newCliente.apellido} onChange={handleInputChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={newCliente.email} onChange={handleInputChange} required />

            <label>Teléfono:</label>
            <input type="text" name="telefono" value={newCliente.telefono} onChange={handleInputChange} required />

            <button type="submit">Guardar</button>
          </FormBase>
        </ModalBase>
      </div>
    </div>
  );
};

export default Clientes;
