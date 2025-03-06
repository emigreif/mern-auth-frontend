import React, { useEffect, useState } from "react";
import ClienteModal from "../components/ClienteModal";
import { useAuth } from "../context/AuthContext.jsx";

const ObrasList = () => {
  const [obras, setObras] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true); // Estado de carga
  const [newObra, setNewObra] = useState({
    nombre: "",
    direccion: "",
    contacto: "",
    fechaEntrega: "",
    cliente: "",
  });

  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 📌 Cargar obras
  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener obras");
        const data = await res.json();
        setObras(data);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };

    if (user) {
      fetchObras();
    }
  }, [API_URL, user]);

  // 📌 Cargar clientes con manejo de errores
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/clientes`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  // 📌 Manejo de los modales
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewObra({ nombre: "", direccion: "", contacto: "", fechaEntrega: "", cliente: "" });
  };

  const handleClienteCreado = (nuevoCliente) => {
    setClientes([...clientes, nuevoCliente]); // Agregar cliente a la lista
    setNewObra((prev) => ({ ...prev, cliente: nuevoCliente._id })); // Seleccionar cliente nuevo
    setIsClienteModalOpen(false);
  };

  // 📌 Manejar cambios en los inputs
  const handleChange = (e) => {
    setNewObra({ ...newObra, [e.target.name]: e.target.value });
  };

  // 📌 Guardar nueva obra
  const handleSave = async () => {
    if (!newObra.cliente) {
      alert("Debes seleccionar un cliente");
      return;
    }

    try {
      const formattedDate = newObra.fechaEntrega ? new Date(newObra.fechaEntrega).toISOString() : null;
      const obraToSend = { ...newObra, fechaEntrega: formattedDate };

      const res = await fetch(`${API_URL}/api/obras`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(obraToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear la obra");
      }

      const createdObra = await res.json();
      setObras([...obras, createdObra]);
      handleCloseModal();
    } catch (error) {
      console.error("Error creando obra:", error);
      alert(error.message);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Obras</h1>

        <button onClick={handleOpenModal}>Agregar Obra</button>

        {obras.length === 0 ? (
          <p>No hay obras registradas.</p>
        ) : (
          obras.map((obra) => (
            <div key={obra._id} className="obra-card">
              <h2>{obra.nombre}</h2>
              <p>{obra.direccion}</p>
              <p>Contacto: {obra.contacto}</p>
              <p>Entrega: {obra.fechaEntrega?.slice(0, 10)}</p>
            </div>
          ))
        )}

        {/* Modal para crear una nueva obra */}
        {isModalOpen && (
          <div className="modal-background" onClick={handleCloseModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <h2>Nueva Obra</h2>

              <label>Nombre:</label>
              <input type="text" name="nombre" value={newObra.nombre} onChange={handleChange} />

              <label>Dirección:</label>
              <input type="text" name="direccion" value={newObra.direccion} onChange={handleChange} />

              <label>Contacto:</label>
              <input type="text" name="contacto" value={newObra.contacto} onChange={handleChange} />

              <label>Fecha de Entrega:</label>
              <input type="date" name="fechaEntrega" value={newObra.fechaEntrega} onChange={handleChange} />

              <label>Cliente:</label>
              {loadingClientes ? (
                <p>Cargando clientes...</p>
              ) : (
                <select name="cliente" value={newObra.cliente} onChange={handleChange}>
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

              <div className="modal-actions">
                <button onClick={handleSave}>Guardar</button>
                <button onClick={handleCloseModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Cliente */}
        <ClienteModal
          isOpen={isClienteModalOpen}
          onClose={() => setIsClienteModalOpen(false)}
          onClienteCreado={handleClienteCreado}
        />
      </div>
    </div>
  );
};

export default ObrasList;
