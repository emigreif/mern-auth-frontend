import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/Compras.css";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [compraData, setCompraData] = useState({ proveedor: "", cantidad: "", fecha: "" });
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/compras`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setCompras(data))
        .catch((error) => console.error("Error fetching compras:", error));
    }
  }, [API_URL, user]);

  const handleInputChange = (e) => {
    setCompraData({ ...compraData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editando ? "PUT" : "POST";
    const endpoint = editando ? `${API_URL}/api/compras/${editando}` : `${API_URL}/api/compras`;

    try {
      const res = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(compraData),
      });

      if (!res.ok) throw new Error("Error al guardar compra");

      const data = await res.json();
      setCompras(editando ? compras.map((c) => (c._id === editando ? data : c)) : [...compras, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al guardar compra:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Compras</h1>
        <button onClick={() => setIsModalOpen(true)}>Agregar Compra</button>

        <div className="compras-list">
          {compras.map((c) => (
            <div key={c._id} className="compra-card">
              <h3>Proveedor: {c.proveedor}</h3>
              <p><strong>Cantidad:</strong> {c.cantidad}</p>
              <p><strong>Fecha:</strong> {c.fecha}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compras;
