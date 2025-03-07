import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ClienteModal from "../components/ClienteModal";
import { useAuth } from "../context/AuthContext.jsx";

Modal.setAppElement("#root");

const PresupuestosList = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true);
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
    indiceCAC: "",
    fechaEntrega: "",
    descripcion: "",
    empresaPerdida: "",
  });

  // 📌 Cargar presupuestos
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

  // 📌 Cargar clientes para selección
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
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, [API_URL]);

  // 📌 Manejo del modal
  const openModal = () => setIsModalOpen(true);
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
      indiceCAC: "",
      fechaEntrega: "",
      descripcion: "",
      empresaPerdida: "",
    });
  };

  // 📌 Manejo del modal de cliente
  const handleClienteCreado = (nuevoCliente) => {
    setClientes([...clientes, nuevoCliente]);
    setNewPresupuesto((prev) => ({ ...prev, cliente: nuevoCliente._id }));
    setIsClienteModalOpen(false);
  };

  // 📌 Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPresupuesto((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 Guardar presupuesto
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 📌 Convertir valores numéricos correctamente
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
        <button onClick={openModal}>Agregar Presupuesto</button>

        {presupuestos.length === 0 ? (
          <p>No hay presupuestos registrados.</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0" width="100%">
            <thead>
              <tr>
                <th>ID Obra</th>
                <th>Nombre de la Obra</th>
                <th>Cliente</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {presupuestos.map((p) => (
                <tr key={p._id}>
                  <td>{p.idObra ? p.idObra : p._id}</td>
                  <td>{p.nombreObra}</td>
                  <td>{p.cliente}</td>
                  <td>{p.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para agregar presupuesto */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Agregar Presupuesto">
        <h2>Agregar Nuevo Presupuesto</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre de la Obra:</label>
          <input type="text" name="nombreObra" value={newPresupuesto.nombreObra} onChange={handleInputChange} required />

          <label>Cliente:</label>
          {loadingClientes ? (
            <p>Cargando clientes...</p>
          ) : (
            <select name="cliente" value={newPresupuesto.cliente} onChange={handleInputChange} required>
              <option value="">Seleccionar Cliente</option>
              {clientes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          )}
          <button type="button" onClick={() => setIsClienteModalOpen(true)}>
            Agregar Nuevo Cliente
          </button>

          <button type="submit">Guardar Presupuesto</button>
        </form>
      </Modal>

      {/* Modal de Cliente */}
      <ClienteModal
        isOpen={isClienteModalOpen}
        onClose={() => setIsClienteModalOpen(false)}
        onClienteCreado={handleClienteCreado}
      />
    </div>
  );
};

export default PresupuestosList;
