import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const ObrasList = () => {
  const [obras, setObras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newObra, setNewObra] = useState({
    nombre: "",
    direccion: "",
    contacto: "",
    fechaEntrega: "",
  });

  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Cargar obras al montar o al cambiar de usuario
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

  // Abrir el modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Cerrar el modal y limpiar el formulario
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewObra({
      nombre: "",
      direccion: "",
      contacto: "",
      fechaEntrega: "",
    });
  };

  // Manejar cambios en los inputs del modal
  const handleChange = (e) => {
    setNewObra({ ...newObra, [e.target.name]: e.target.value });
  };

  // Guardar la nueva obra en el backend
  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newObra),
      });
      if (!res.ok) throw new Error("Error al crear la obra");

      // Obtener la obra recién creada
      const createdObra = await res.json();

      // Actualizar la lista sin volver a hacer fetch completo
      setObras([...obras, createdObra]);

      // Cerrar el modal
      handleCloseModal();
    } catch (error) {
      console.error("Error creando obra:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Obras</h1>

        {/* Botón para abrir el modal */}
        <button onClick={handleOpenModal}>Agregar Obra</button>

        {obras.length === 0 ? (
          <p>No hay obras registradas para este usuario.</p>
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

        {/* Modal para crear una nueva obra */}
        {isModalOpen && (
          <div className="modal-background" onClick={handleCloseModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <h2>Nueva Obra</h2>

              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={newObra.nombre}
                onChange={handleChange}
              />

              <label>Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={newObra.direccion}
                onChange={handleChange}
              />

              <label>Contacto:</label>
              <input
                type="text"
                name="contacto"
                value={newObra.contacto}
                onChange={handleChange}
              />

              <label>Fecha de Entrega:</label>
              <input
                type="date"
                name="fechaEntrega"
                value={newObra.fechaEntrega}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button onClick={handleSave}>Guardar</button>
                <button onClick={handleCloseModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObrasList;
