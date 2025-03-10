import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/ProveedoresList.css";

const ProveedoresList = () => {
  const [proveedores, setProveedores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [proveedorData, setProveedorData] = useState({ nombre: "", direccion: "", email: "", telefono: "" });
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
    setProveedorData({ ...proveedorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editando ? "PUT" : "POST";
    const endpoint = editando ? `${API_URL}/api/proveedores/${editando}` : `${API_URL}/api/proveedores`;

    try {
      const res = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(proveedorData),
      });

      if (!res.ok) throw new Error("Error al guardar proveedor");

      const data = await res.json();
      setProveedores(editando ? proveedores.map((p) => (p._id === editando ? data : p)) : [...proveedores, data]);
      closeModal();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;

    try {
      const res = await fetch(`${API_URL}/api/proveedores/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Error al eliminar proveedor");

      setProveedores(proveedores.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
    }
  };

  const openEditModal = (proveedor) => {
    setProveedorData(proveedor);
    setEditando(proveedor._id);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setProveedorData({ nombre: "", direccion: "", email: "", telefono: "" });
    setEditando(null);
    setIsModalOpen(true);
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Proveedores</h1>
        <button onClick={openAddModal}>Agregar Proveedor</button>

        {/* 📋 Lista de Proveedores en tarjetas */}
        <div className="proveedores-list">
          {proveedores.map((p) => (
            <div key={p._id} className="proveedor-card">
              <h3>{p.nombre}</h3>
              <p><strong>Dirección:</strong> {p.direccion}</p>
              <p><strong>Email:</strong> {p.email}</p>
              <p><strong>Teléfono:</strong> {p.telefono}</p>
              <div className="action-buttons">
                <button onClick={() => openEditModal(p)}>✏️ Editar</button>
                <button onClick={() => handleDelete(p._id)}>❌ Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🏗️ Modal para agregar/editar proveedor */}
      <ModalBase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editando ? "Editar Proveedor" : "Agregar Proveedor"}>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={proveedorData.nombre} onChange={handleInputChange} required />
          <label>Dirección:</label>
          <input type="text" name="direccion" value={proveedorData.direccion} onChange={handleInputChange} required />
          <label>Email:</label>
          <input type="email" name="email" value={proveedorData.email} onChange={handleInputChange} required />
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={proveedorData.telefono} onChange={handleInputChange} required />
          <button type="submit">{editando ? "Actualizar" : "Guardar"}</button>
        </form>
      </ModalBase>
    </div>
  );
};

export default ProveedoresList;
