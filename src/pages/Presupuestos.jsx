import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ClienteModal from "../components/ClienteModal";
import { useAuth } from "../context/AuthContext.jsx";

Modal.setAppElement("#root");

const PresupuestosList = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clienteModalIsOpen, setClienteModalIsOpen] = useState(false);
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
      fetchPresupuestos();
      fetchClientes();
    }
  }, [API_URL, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPresupuesto((prev) => ({ ...prev, [name]: value }));
  };

  const handleClienteCreado = (nuevoCliente) => {
    setClientes([...clientes, nuevoCliente]);
    setNewPresupuesto((prev) => ({ ...prev, cliente: nuevoCliente._id }));
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Presupuestos</h1>
        <button onClick={() => setModalIsOpen(true)}>Agregar Presupuesto</button>

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

      {/* Modal de Presupuesto */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Agregar Presupuesto">
        <h2>Agregar Nuevo Presupuesto</h2>
        <form>
          <label>Nombre de la Obra:</label>
          <input type="text" name="nombreObra" value={newPresupuesto.nombreObra} onChange={handleInputChange} required />

          <label>Cliente:</label>
          <select name="cliente" value={newPresupuesto.cliente} onChange={handleInputChange} required>
            <option value="">Seleccionar Cliente</option>
            {clientes.map((c) => (
              <option key={c._id} value={c._id}>{c.nombre}</option>
            ))}
          </select>
          <button type="button" onClick={() => setClienteModalIsOpen(true)}>Agregar Nuevo Cliente</button>

          <button type="submit">Guardar Presupuesto</button>
        </form>
      </Modal>

      {/* Modal de Cliente */}
      <ClienteModal isOpen={clienteModalIsOpen} onClose={() => setClienteModalIsOpen(false)} onClienteCreado={handleClienteCreado} />
    </div>
  );
};

export default PresupuestosList;
