import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "../components/ModalBase.jsx";

const Obras = () => {
  const [obras, setObras] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState({});
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [mostrarOpcionales, setMostrarOpcionales] = useState(false);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "https://mern-auth-backend.onrender.com";

  const [newObra, setNewObra] = useState({
    nombre: "",
    cliente: "",
    direccion: "",
    contacto: "",
    fechaEntrega: "",
    importeConFactura: "",
    importeSinFactura: "",
    mapa: "",
    encargado: "",
  });

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  // 📌 Cargar obras existentes
  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Error al obtener obras");
        const data = await res.json();
        setObras(data);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };

    if (user) fetchObras();
  }, [API_URL, user]);

  // 📌 Cargar clientes existentes
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

    fetchClientes();
  }, [API_URL]);

  // 📌 Manejo del modal de obra
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewObra({
      nombre: "",
      cliente: "",
      direccion: "",
      contacto: "",
      fechaEntrega: "",
      importeConFactura: "",
      importeSinFactura: "",
      mapa: "",
      encargado: "",
    });
    setMostrarOpcionales(false);
  };

  // 📌 Manejo del modal de cliente
  const handleClienteCreado = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(nuevoCliente),
      });

      if (!res.ok) throw new Error("Error al crear cliente");

      const data = await res.json();
      setClientes([...clientes, data]);
      setNewObra((prev) => ({ ...prev, cliente: data._id }));
      setIsClienteModalOpen(false);
    } catch (error) {
      console.error("Error creando cliente:", error);
    }
  };

  // 📌 Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewObra((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 Guardar nueva obra
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(newObra),
      });

      if (!res.ok) throw new Error("Error al crear obra");

      const data = await res.json();
      setObras([...obras, data]);
      closeModal();
    } catch (error) {
      console.error("Error creating obra:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Obras</h1>
        <button onClick={openModal}>Agregar Obra</button>

        {obras.length === 0 ? (
          <p>No hay obras registradas.</p>
        ) : (
          <div className="obras-list">
            {obras.map((obra) => (
              <div
                key={obra._id}
                className="obra-card"
                onClick={() => setIsExpanded((prev) => ({ ...prev, [obra._id]: !prev[obra._id] }))}
              >
                <h2>{obra.nombre}</h2>
                <p><strong>Cliente:</strong> {obra.cliente.nombre}</p>
                <p><strong>Estado:</strong> {obra.estado}</p>
                {isExpanded[obra._id] && (
                  <div className="obra-detalles">
                    <p><strong>Dirección:</strong> {obra.direccion}</p>
                    <p><strong>Contacto:</strong> {obra.contacto}</p>
                    <p><strong>Fecha de entrega:</strong> {obra.fechaEntrega}</p>
                    <p><strong>Importe:</strong> ${obra.importeTotal}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar obra */}
      <ModalBase isOpen={isModalOpen} onClose={closeModal} title="Agregar Nueva Obra">
        <form onSubmit={handleSubmit}>
          <label>Nombre de la Obra:</label>
          <input type="text" name="nombre" value={newObra.nombre} onChange={handleInputChange} required />

          <label>Cliente:</label>
          <select name="cliente" value={newObra.cliente} onChange={handleInputChange} required>
            <option value="">Seleccionar Cliente</option>
            {clientes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nombre} {c.apellido}
              </option>
            ))}
          </select>

          <label>Dirección:</label>
          <input type="text" name="direccion" value={newObra.direccion} onChange={handleInputChange} required />

          <label>Contacto:</label>
          <input type="text" name="contacto" value={newObra.contacto} onChange={handleInputChange} required />

          <button type="submit">Guardar</button>
          <button type="button" onClick={closeModal}>Cancelar</button>
        </form>
      </ModalBase>
    </div>
  );
};

export default Obras;
