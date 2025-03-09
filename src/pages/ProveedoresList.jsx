import React, { useState, useEffect } from "react";
import TableBase from "../components/TableBase.jsx";
import ModalBase from "../components/ModalBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/ProveedoresList.css";

const ProveedoresList = () => {
  const [proveedores, setProveedores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState({ nombre: "", direccion: "", email: "", telefono: "" });
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/proveedores`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setProveedores(data))
        .catch((error) => console.error("Error fetching proveedores:", error));
    }
  }, [API_URL, user]);

  const handleInputChange = (e) => {
    setNuevoProveedor({ ...nuevoProveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProveedores([...proveedores, nuevoProveedor]);
    setIsModalOpen(false);
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Proveedores</h1>
        <button onClick={() => setIsModalOpen(true)}>Agregar Proveedor</button>

        <TableBase
          headers={["Nombre", "Dirección", "Email", "Teléfono"]}
          data={proveedores.map((p) => ({
            Nombre: p.nombre,
            Dirección: p.direccion,
            Email: p.email,
            Teléfono: p.telefono,
          }))}
        />

        <ModalBase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Agregar Proveedor</h2>
          <form onSubmit={handleSubmit}>
            <label>Nombre:</label>
            <input type="text" name="nombre" value={nuevoProveedor.nombre} onChange={handleInputChange} required />
            <label>Dirección:</label>
            <input type="text" name="direccion" value={nuevoProveedor.direccion} onChange={handleInputChange} required />
            <label>Email:</label>
            <input type="email" name="email" value={nuevoProveedor.email} onChange={handleInputChange} required />
            <label>Teléfono:</label>
            <input type="text" name="telefono" value={nuevoProveedor.telefono} onChange={handleInputChange} required />
            <button type="submit">Guardar</button>
          </form>
        </ModalBase>
      </div>
    </div>
  );
};

export default ProveedoresList;
