import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "https://mern-auth-backend.onrender.com";

  const [clienteActual, setClienteActual] = useState({
    tipoCliente: "particular",
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
    direccion: { calle: "", ciudad: "" },
    notas: "",
  });

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

    if (user) fetchClientes();
  }, [API_URL, user]);

  const abrirModalCrear = () => {
    setClienteActual({
      tipoCliente: "particular",
      nombre: "",
      apellido: "",
      empresa: "",
      email: "",
      telefono: "",
      direccion: { calle: "", ciudad: "" },
      notas: "",
    });
    setIsModalOpen(true);
  };
  const cerrarModalCrear = () => setIsModalOpen(false);

  const abrirModalEditar = (cliente) => {
    setClienteActual(cliente);
    setIsEditModalOpen(true);
  };
  const cerrarModalEditar = () => setIsEditModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("direccion")) {
      setClienteActual({
        ...clienteActual,
        direccion: { ...clienteActual.direccion, [name.split(".")[1]]: value },
      });
    } else {
      setClienteActual({ ...clienteActual, [name]: value });
    }
  };

  const handleCrearCliente = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(clienteActual),
      });

      if (!res.ok) throw new Error("Error al agregar cliente");

      const data = await res.json();
      setClientes([...clientes, data]);
      cerrarModalCrear();
    } catch (error) {
      console.error("Error adding cliente:", error);
    }
  };

  const handleEditarCliente = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/clientes/${clienteActual._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(clienteActual),
      });

      if (!res.ok) throw new Error("Error al actualizar cliente");

      const data = await res.json();
      setClientes(clientes.map((c) => (c._id === data._id ? data : c)));
      cerrarModalEditar();
    } catch (error) {
      console.error("Error updating cliente:", error);
    }
  };

  const handleEliminarCliente = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este cliente?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/api/clientes/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Error al eliminar cliente");

      setClientes(clientes.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting cliente:", error);
    }
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Clientes</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={abrirModalCrear} className="add-button">
          <FaPlus /> Agregar Cliente
        </button>

        <div className="clientes-list">
          {clientesFiltrados.map((cliente) => (
            <div key={cliente._id} className="cliente-card">
              <h1>{cliente.nombre} {cliente.apellido}</h1>
              <div> <strong>Email:</strong> {cliente.email}</div>
              <div><strong>Teléfono:</strong> {cliente.telefono}</div>
              <div><strong>Dirección:</strong> {cliente.direccion.calle}, {cliente.direccion.ciudad}</div>

              <div className="cliente-actions">
                <button onClick={() => abrirModalEditar(cliente)} className="edit-button">
                  <FaEdit /> Editar
                </button>
                <button onClick={() => handleEliminarCliente(cliente._id)} className="delete-button">
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar cliente */}
      <ModalBase isOpen={isModalOpen} onClose={cerrarModalCrear} title="Agregar Cliente">
        <form onSubmit={handleCrearCliente}>
          <input type="text" name="nombre" placeholder="Nombre" value={clienteActual.nombre} onChange={handleInputChange} required />
          <input type="text" name="apellido" placeholder="Apellido" value={clienteActual.apellido} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email" value={clienteActual.email} onChange={handleInputChange} required />
          <input type="text" name="telefono" placeholder="Telefono" value={clienteActual.telefono} onChange={handleInputChange} required />
          <input type="text" name="direccion.calle" placeholder="Dirección" value={clienteActual.direccion.calle} onChange={handleInputChange} required />
          <input type="text" name="direccion.ciudad" placeholder="Ciudad" value={clienteActual.direccion.ciudad} onChange={handleInputChange} required />
          <button type="submit">Guardar</button>
        </form>
      </ModalBase>
    </div>
  );
};

export default Clientes;
