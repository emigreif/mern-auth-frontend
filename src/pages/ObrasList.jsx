// frontend/src/pages/ObrasList.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/ObrasList.css';

Modal.setAppElement('#root');

const ObrasList = () => {
  const [obras, setObras] = useState([]);
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newObra, setNewObra] = useState({
    nombre: "",
    direccion: "",
    contacto: "",
    fechaEntrega: "",
    cliente: "",
  });

  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Cargar obras
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
        setClientes(data);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };

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
      }
    };

    if (user) {
      fetchObras();
      fetchClientes();
    }
  }, [API_URL, user]);

  // Función para asignar color al semáforo según estado (ejemplo)
  const getTrafficLightColor = (status) => {
    switch (status) {
      case 'cumplido':
      case 'aprobado':
        return 'green';
      case 'proximo':
        return 'yellow';
      case 'pendiente':
      default:
        return 'red';
    }
  };

  // Abrir modal de detalles de obra
  const openDetallesModal = (obra) => {
    setSelectedObra(obra);
    setModalDetallesOpen(true);
  };

  const closeDetallesModal = () => {
    setSelectedObra(null);
    setModalDetallesOpen(false);
  };

  // Abrir modal para crear nueva obra
  const openNuevaObraModal = () => {
    setModalNuevaObraOpen(true);
  };

  const closeNuevaObraModal = () => {
    setModalNuevaObraOpen(false);
    // Reiniciar formulario
    setNewObra({
      nombre: "",
      direccion: "",
      contacto: "",
      fechaEntrega: "",
      cliente: "",
    });
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setNewObra({ ...newObra, [e.target.name]: e.target.value });
  };

  // Guardar la nueva obra
  const handleSave = async () => {
    if (!newObra.cliente) {
      alert("Debes seleccionar un cliente");
      return;
    }

    const formattedDate = newObra.fechaEntrega
      ? new Date(newObra.fechaEntrega).toISOString()
      : null;

    try {
      console.log("Enviando:", JSON.stringify({ ...newObra, fechaEntrega: formattedDate }, null, 2));

      const res = await fetch(`${API_URL}/api/obras`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...newObra, fechaEntrega: formattedDate }),
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
              <p>Entrega: {obra.fechaEntrega?.slice(0,10)}</p>
            </div>
          ))
        )}

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
              <select name="cliente" value={newObra.cliente} onChange={handleChange}>
                <option value="">Seleccionar Cliente</option>
                {clientes.map((c) => (
                  <option key={c._id} value={c._id}>{c.nombre}</option>
                ))}
              </select>

              <div className="modal-actions">
                <button onClick={handleSave}>Guardar</button>
                <button onClick={handleCloseModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        <button onClick={closeDetallesModal}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default ObrasList;