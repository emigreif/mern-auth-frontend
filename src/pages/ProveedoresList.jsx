import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useAuth } from "../context/AuthContext.jsx";

// Configuramos el elemento raíz para el modal
Modal.setAppElement("#root");

const ProveedoresList = () => {
  const [proveedores, setProveedores] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Estados para el modal y formulario de nuevo proveedor
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newProveedor, setNewProveedor] = useState({
    nombre: "",
    direccion: "",
    emails: "",
    telefono: "",
    whatsapp: "",
    rubro: ""
  });

  // Cargar proveedores del usuario
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await fetch(`${API_URL}/api/proveedores`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener proveedores");
        const data = await res.json();
        setProveedores(data);
      } catch (error) {
        console.error("Error fetching proveedores:", error);
      }
    };

    if (user) {
      fetchProveedores();
    }
  }, [API_URL, user]);

  // Manejo del modal
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Actualizar los datos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProveedor((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar el formulario para crear un nuevo proveedor
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convertir emails y rubro a arrays (suponiendo que se ingresen separados por comas)
    const payload = {
      ...newProveedor,
      emails: newProveedor.emails.split(",").map((email) => email.trim()).filter(Boolean),
      rubro: newProveedor.rubro.split(",").map((r) => r.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al crear proveedor");
      const data = await res.json();
      setProveedores((prev) => [...prev, data]);
      closeModal();
      setNewProveedor({
        nombre: "",
        direccion: "",
        emails: "",
        telefono: "",
        whatsapp: "",
        rubro: ""
      });
    } catch (error) {
      console.error("Error creating proveedor:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Proveedores</h1>
        <button onClick={openModal}>Agregar Proveedor</button>
        {proveedores.length === 0 ? (
          <p>No hay proveedores registrados.</p>
        ) : (
          proveedores.map((prov) => (
            <div key={prov._id} className="proveedor-card">
              <h2>{prov.nombre}</h2>
              <p>Dirección: {prov.direccion}</p>
              <p>Emails: {prov.emails.join(", ")}</p>
              <p>Teléfono: {prov.telefono}</p>
              <p>WhatsApp: {prov.whatsapp}</p>
              <p>Rubros: {prov.rubro.join(", ")}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal para agregar un nuevo proveedor */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Proveedor"
        style={{
          content: { width: "500px", margin: "auto" },
        }}
      >
        <h2>Agregar Nuevo Proveedor</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={newProveedor.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={newProveedor.direccion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Emails (separados por comas):</label>
            <input
              type="text"
              name="emails"
              value={newProveedor.emails}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={newProveedor.telefono}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>WhatsApp:</label>
            <input
              type="text"
              name="whatsapp"
              value={newProveedor.whatsapp}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Rubros (separados por comas):</label>
            <input
              type="text"
              name="rubro"
              value={newProveedor.rubro}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <button type="submit">Guardar Proveedor</button>
            <button type="button" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProveedoresList;
