import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import TableBase from "../components/TableBase.jsx";
import FormBase from "../components/FormBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompra, setNewCompra] = useState({ proveedor: "", cantidad: "", fecha: "" });
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/compras`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Error al obtener compras");
        const data = await res.json();
        setCompras(data);
      } catch (error) {
        console.error("Error fetching compras:", error);
      }
    };

    if (user) {
      fetchCompras();
    }
  }, [API_URL, user]);

  const handleInputChange = (e) => {
    setNewCompra({ ...newCompra, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/compras`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(newCompra),
      });
      if (!res.ok) throw new Error("Error al agregar compra");
      const data = await res.json();
      setCompras([...compras, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding compra:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Compras</h1>
        <button onClick={() => setIsModalOpen(true)}>Agregar Compra</button>

        <TableBase
          headers={["Proveedor", "Cantidad", "Fecha"]}
          data={compras.map((c) => ({
            Proveedor: c.proveedor,
            Cantidad: c.cantidad,
            Fecha: c.fecha,
          }))}
        />

        <ModalBase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Agregar Compra</h2>
          <FormBase onSubmit={handleSubmit}>
            <label>Proveedor:</label>
            <input type="text" name="proveedor" value={newCompra.proveedor} onChange={handleInputChange} required />

            <label>Cantidad:</label>
            <input type="number" name="cantidad" value={newCompra.cantidad} onChange={handleInputChange} required />

            <label>Fecha:</label>
            <input type="date" name="fecha" value={newCompra.fecha} onChange={handleInputChange} required />

            <button type="submit">Guardar</button>
          </FormBase>
        </ModalBase>
      </div>
    </div>
  );
};

export default Compras;
