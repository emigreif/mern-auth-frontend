// src/pages/Obras.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Obras = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Estado para la lista de obras
  const [obras, setObras] = useState([]);
  // Modal para crear obra
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para la lista de clientes
  const [clients, setClients] = useState([]);
  // Modal para crear cliente
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  // Datos de la obra nueva
  const [newObra, setNewObra] = useState({
    nombre: "",
    cliente: "",             // Será un ObjectId
    direccion: "",
    contacto: "",
    fechaEntrega: "",
    importeTotal: 0,
    importeConFactura: 0,
    importeSinFactura: 0,
  });

  // Datos de un nuevo cliente (para el segundo modal)
  const [newClient, setNewClient] = useState({
    tipoCliente: "particular",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: { calle: "", ciudad: "" },
  });

  // 1. Cargar la lista de obras (GET /api/obras)
  useEffect(() => {
    if (!token) return;
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener obras");
        const data = await res.json();
        setObras(data);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };
    fetchObras();
  }, [API_URL, token]);

  // 2. Cargar la lista de clientes (GET /api/clientes)
  useEffect(() => {
    if (!token) return;
    const fetchClients = async () => {
      try {
        const res = await fetch(`${API_URL}/api/clientes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener clientes");
        const data = await res.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, [API_URL, token]);

  // Manejar cambios en los campos de la obra
  const handleObraInputChange = (e) => {
    const { name, value } = e.target;
    setNewObra({ ...newObra, [name]: value });
  };

  // Crear la obra (POST /api/obras)
  const handleCreateObra = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newObra),
      });
      if (!res.ok) throw new Error("Error al crear obra");
      const data = await res.json();
      setObras([...obras, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating obra:", error);
    }
  };

  // Manejar cambios en los campos del nuevo cliente
  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("direccion.")) {
      const subfield = name.split(".")[1];
      setNewClient({
        ...newClient,
        direccion: { ...newClient.direccion, [subfield]: value },
      });
    } else {
      setNewClient({ ...newClient, [name]: value });
    }
  };

  // Crear cliente (POST /api/clientes)
  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newClient),
      });
      if (!res.ok) throw new Error("Error al crear cliente");
      const data = await res.json();
      // Actualizamos la lista de clientes para poder seleccionarlo
      setClients((prev) => [...prev, data]);
      // Cerramos el modal
      setIsClientModalOpen(false);
      // Opcional: limpiar newClient
      setNewClient({
        tipoCliente: "particular",
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: { calle: "", ciudad: "" },
      });
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  return (
    <div className="page-contenedor">
      <h1>Obras</h1>

      {/* Botón para abrir el modal de crear obra */}
      <button className="btn" onClick={() => setIsModalOpen(true)}>
        Agregar Obra
      </button>

      {/* Lista de obras */}
      <div className="obra-list">
        {obras.map((obra) => (
          <div key={obra._id} className="obra-item">
            {/* Encabezado: ID y Nombre, Fecha de Entrega */}
            <div className="obra-header">
              <div className="obra-id-name">
                <span className="obra-id">{obra.codigoObra}</span> -{" "}
                <span className="obra-name">{obra.nombre}</span>
              </div>
              <div className="obra-entrega">
                Entrega: {obra.fechaEntrega?.slice(0, 10) || "Sin definir"}
              </div>
            </div>

            {/* Info: dirección y contacto */}
            <div className="obra-info">
              <div className="obra-address">{obra.direccion}</div>
              <div className="obra-contact">{obra.contacto}</div>
            </div>

            {/* Mostrar importes */}
            <div>
              <strong>Importe Total:</strong> {obra.importeTotal}
              <br />
              <strong>Importe Con Factura:</strong> {obra.importeConFactura}
              <br />
              <strong>Importe Sin Factura:</strong> {obra.importeSinFactura}
            </div>

            {/* Estados (perfiles, vidrios, etc.) */}
            <div className="obra-status-row">
              <span className={`obra-status-step ${obra.estado?.perfiles || "pending"}`}>
                PERFILES
              </span>
              <span className={`obra-status-step ${obra.estado?.vidrios || "pending"}`}>
                VIDRIOS
              </span>
              <span className={`obra-status-step ${obra.estado?.accesorios || "pending"}`}>
                ACCESORIOS
              </span>
              <span className={`obra-status-step ${obra.estado?.medicion || "pending"}`}>
                MEDICIÓN
              </span>
              <span className={`obra-status-step ${obra.estado?.aprobada || "pending"}`}>
                OP APROBADA CLIENTE
              </span>
            </div>

            {/* Saldo o estado final */}
            <div className="obra-saldo">{obra.saldo}</div>
          </div>
        ))}
      </div>

      {/* Modal para crear obra */}
      <ModalBase
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Obra"
      >
        <form onSubmit={handleCreateObra}>
          <div className="form-group">
            <label>Nombre de la Obra</label>
            <input
              type="text"
              name="nombre"
              onChange={handleObraInputChange}
              required
            />
          </div>

          {/* Selección de cliente */}
          <div className="form-group">
            <label>Cliente</label>
            <select
              name="cliente"
              value={newObra.cliente}
              onChange={handleObraInputChange}
              required
            >
              <option value="">Seleccionar cliente</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.nombre} {c.apellido} - {c.email}
                </option>
              ))}
            </select>
            {/* Botón para abrir modal de crear cliente */}
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setIsClientModalOpen(true)}
            >
              Agregar Cliente
            </button>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              onChange={handleObraInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contacto</label>
            <input
              type="text"
              name="contacto"
              onChange={handleObraInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha de Entrega</label>
            <input
              type="date"
              name="fechaEntrega"
              onChange={handleObraInputChange}
            />
          </div>
          <div className="form-group">
            <label>Importe Total</label>
            <input
              type="number"
              name="importeTotal"
              onChange={handleObraInputChange}
            />
          </div>
          <div className="form-group">
            <label>Importe Con Factura</label>
            <input
              type="number"
              name="importeConFactura"
              onChange={handleObraInputChange}
            />
          </div>
          <div className="form-group">
            <label>Importe Sin Factura</label>
            <input
              type="number"
              name="importeSinFactura"
              onChange={handleObraInputChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn">
              Guardar
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>

      {/* Modal para crear cliente */}
      <ModalBase
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        title="Agregar Cliente"
      >
        <form onSubmit={handleCreateClient}>
          <div className="form-group">
            <label>Tipo de Cliente</label>
            <select
              name="tipoCliente"
              value={newClient.tipoCliente}
              onChange={handleClientInputChange}
            >
              <option value="particular">Particular</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={newClient.nombre}
              onChange={handleClientInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={newClient.apellido}
              onChange={handleClientInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={newClient.email}
              onChange={handleClientInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={newClient.telefono}
              onChange={handleClientInputChange}
            />
          </div>
          <div className="form-group">
            <label>Dirección - Calle</label>
            <input
              type="text"
              name="direccion.calle"
              value={newClient.direccion.calle}
              onChange={handleClientInputChange}
            />
          </div>
          <div className="form-group">
            <label>Dirección - Ciudad</label>
            <input
              type="text"
              name="direccion.ciudad"
              value={newClient.direccion.ciudad}
              onChange={handleClientInputChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn">
              Guardar
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setIsClientModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>
    </div>
  );
};

export default Obras;
