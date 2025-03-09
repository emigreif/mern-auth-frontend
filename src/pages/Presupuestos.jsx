import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import TableBase from "../components/TableBase.jsx";
import FormBase from "../components/FormBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Presupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [newPresupuesto, setNewPresupuesto] = useState({
    nombreObra: "",
    cliente: "",
    estado: "pendiente",
    direccion: "",
    totalPresupuestado: "",
    totalConFactura: "",
    totalSinFactura: "",
  });

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/presupuestos`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Error al obtener presupuestos");
        const data = await res.json();
        setPresupuestos(data);
      } catch (error) {
        console.error("Error fetching presupuestos:", error);
      }
    };

    if (user) {
      fetchPresupuestos();
    }
  }, [API_URL, user]);

  const closeModal = () => {
    setIsModalOpen(false);
    setNewPresupuesto({
      nombreObra: "",
      cliente: "",
      estado: "pendiente",
      direccion: "",
      totalPresupuestado: "",
      totalConFactura: "",
      totalSinFactura: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPresupuesto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...newPresupuesto,
      totalPresupuestado: Number(newPresupuesto.totalPresupuestado) || 0,
      totalConFactura: Number(newPresupuesto.totalConFactura) || 0,
      totalSinFactura: Number(newPresupuesto.totalSinFactura) || 0,
    };

    try {
      const res = await fetch(`${API_URL}/api/presupuestos`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al crear presupuesto");

      const data = await res.json();
      setPresupuestos([...presupuestos, data]);
      closeModal();
    } catch (error) {
      console.error("Error creating presupuesto:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Presupuestos</h1>
        <button onClick={() => setIsModalOpen(true)}>Agregar Presupuesto</button>

        <TableBase
          headers={["ID Obra", "Nombre de la Obra", "Cliente", "Estado"]}
          data={presupuestos.map((p) => ({
            ID: p.idObra || p._id,
            Nombre: p.nombreObra,
            Cliente: p.cliente,
            Estado: p.estado,
          }))}
        />

        <ModalBase isOpen={isModalOpen} onClose={closeModal}>
          <h2>Agregar Nuevo Presupuesto</h2>
          <FormBase onSubmit={handleSubmit}>
            <label>Nombre de la Obra:</label>
            <input type="text" name="nombreObra" value={newPresupuesto.nombreObra} onChange={handleInputChange} required />

            <label>Cliente:</label>
            <select name="cliente" value={newPresupuesto.cliente} onChange={handleInputChange} required>
              <option value="">Seleccionar Cliente</option>
              {clientes.map((c) => (
                <option key={c._id} value={c._id}>{c.nombre} {c.apellido}</option>
              ))}
            </select>

            <button type="submit">Guardar Presupuesto</button>
          </FormBase>
        </ModalBase>
      </div>
    </div>
  );
};

export default Presupuestos;
