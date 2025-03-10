import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "../components/ModalBase.jsx";

const Obras = () => {
  const [obras, setObras] = useState([]);
  const [filteredObras, setFilteredObras] = useState([]);////
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false); // Modal de agregar cliente
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "https://mern-auth-backend.onrender.com";

  const [obraData, setObraData] = useState({
    nombre: "",
    cliente: "",
    direccion: "",
    fechaEntrega: "",
    importeConFactura: "",
    importeSinFactura: "",
    importeTotal: 0, // Se calcula automáticamente
  });

  const [newCliente, setNewCliente] = useState({ nombre: "", apellido: "", email: "", telefono: "" });

  // 📌 Cargar Obras desde el Backend
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
        setFilteredObras(data);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };

    if (user) fetchObras();
  }, [API_URL, user]);

  // 📌 Cargar clientes desde el Backend
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

  // 📌 Filtrar obras por nombre o cliente
  useEffect(() => {
    setFilteredObras(
      obras.filter(
        (obra) =>
          obra.nombre.toLowerCase().includes(search.toLowerCase()) ||
          (obra.cliente?.nombre && obra.cliente.nombre.toLowerCase().includes(search.toLowerCase()))
      )
    );
  }, [search, obras]);

  // 📌 Manejo del modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setObraData({
      nombre: "",
      cliente: "",
      direccion: "",
      fechaEntrega: "",
      importeConFactura: "",
      importeSinFactura: "",
      importeTotal: 0,
    });
  };

  // 📌 Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setObraData((prev) => ({
      ...prev,
      [name]: value,
      importeTotal:
        name === "importeConFactura" || name === "importeSinFactura"
          ? Number(prev.importeConFactura || 0) + Number(prev.importeSinFactura || 0)
          : prev.importeTotal,
    }));
  };

  // 📌 Guardar nueva obra
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...obraData,
      importeConFactura: Number(obraData.importeConFactura) || 0,
      importeSinFactura: Number(obraData.importeSinFactura) || 0,
      importeTotal: Number(obraData.importeConFactura) + Number(obraData.importeSinFactura),
    };

    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(payload),
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

        {/* 🔍 Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        {/* ➕ Botón para agregar obra */}
        <button onClick={openModal} className="add-button">Agregar Obra</button>

        {/* 📋 Lista de obras */}
        {filteredObras.length === 0 ? (
          <p>No hay obras registradas.</p>
        ) : (
          <div className="obras-list">
            {filteredObras.map((obra) => (
              <div key={obra._id} className="obra-card">
                <h2>{obra.codigoObra} - {obra.nombre}</h2>
                <p><strong>Cliente:</strong> {obra.cliente?.nombre || "Sin cliente"}</p>
                <p><strong>Dirección:</strong> {obra.direccion}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🏗️ Modal para agregar obra */}
      <ModalBase isOpen={isModalOpen} onClose={closeModal} title="Agregar Nueva Obra">
        <form onSubmit={handleSubmit}>
          <label>Nombre de la Obra:</label>
          <input type="text" name="nombre" value={obraData.nombre} onChange={handleInputChange} required />

          <label>Cliente:</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <select name="cliente" value={obraData.cliente} onChange={handleInputChange} required>
              <option value="">Seleccionar Cliente</option>
              {clientes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setIsClienteModalOpen(true)}>+</button>
          </div>

          <label>Dirección:</label>
          <input type="text" name="direccion" value={obraData.direccion} onChange={handleInputChange} required />

          <label>Fecha de Entrega:</label>
          <input type="date" name="fechaEntrega" value={obraData.fechaEntrega} onChange={handleInputChange} />

          <label>Importe con Factura:</label>
          <input type="number" name="importeConFactura" value={obraData.importeConFactura} onChange={handleInputChange} />

          <label>Importe sin Factura:</label>
          <input type="number" name="importeSinFactura" value={obraData.importeSinFactura} onChange={handleInputChange} />
          

          <button type="submit">Guardar</button>
          
        </form>
      </ModalBase>
    </div>
  );
};

export default Obras;
