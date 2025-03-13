// src/pages/Presupuestos.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx"; 
import { useAuth } from "../context/AuthContext.jsx";

export default function Presupuestos() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Lista de presupuestos y clientes
  const [presupuestos, setPresupuestos] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Filtro
  const [searchTerm, setSearchTerm] = useState("");

  // Modal principal
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState(null);

  // Sub-modal: crear Obra
  const [isObraModalOpen, setIsObraModalOpen] = useState(false);

  // Sub-modal: crear Cliente
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);

  // Form Presupuesto
  const [presupuestoForm, setPresupuestoForm] = useState({
    // Quitamos idObra, idPresupuesto. El backend lo genera.
    nombreObra: "",
    cliente: "",
    estado: "pendiente",
    empresaPerdida: "",
    totalPresupuestado: 0,
    totalConFactura: 0,
    totalSinFactura: 0,
    direccion: "",
    fechaEntrega: "",
    descripcion: "",
  });

  // Form Obra
  const [obraForm, setObraForm] = useState({
    nombre: "",
    direccion: "",
    fechaEntrega: "",
    contacto: "",
  });

  // Form Cliente
  const [clienteForm, setClienteForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  // Mensajes
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Cargar datos
  useEffect(() => {
    if (token) {
      fetchPresupuestos();
      fetchClientes();
    }
  }, [token]);

  const fetchPresupuestos = async () => {
    try {
      setErrorMsg("");
      const res = await fetch(`${API_URL}/api/presupuestos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener presupuestos");
      const data = await res.json();
      setPresupuestos(data);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  const fetchClientes = async () => {
    try {
      setErrorMsg("");
      const res = await fetch(`${API_URL}/api/clientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener clientes");
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  // Filtro
  const filteredPresupuestos = presupuestos.filter((p) =>
    p.nombreObra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Crear
  const handleOpenCreate = () => {
    setEditingPresupuesto(null);
    setPresupuestoForm({
      nombreObra: "",
      cliente: "",
      estado: "pendiente",
      empresaPerdida: "",
      totalPresupuestado: 0,
      totalConFactura: 0,
      totalSinFactura: 0,
      direccion: "",
      fechaEntrega: "",
      descripcion: "",
    });
    setErrorMsg("");
    setSuccessMsg("");
    setIsMainModalOpen(true);
  };

  // Editar
  const handleOpenEdit = (pres) => {
    setEditingPresupuesto(pres);
    setErrorMsg("");
    setSuccessMsg("");

    const clienteId =
      typeof pres.cliente === "object" && pres.cliente
        ? pres.cliente._id
        : pres.cliente || "";

    setPresupuestoForm({
      nombreObra: pres.nombreObra || "",
      cliente: clienteId,
      estado: pres.estado || "pendiente",
      empresaPerdida: pres.empresaPerdida || "",
      totalPresupuestado: pres.totalPresupuestado || 0,
      totalConFactura: pres.totalConFactura || 0,
      totalSinFactura: pres.totalSinFactura || 0,
      direccion: pres.direccion || "",
      fechaEntrega: pres.fechaEntrega ? pres.fechaEntrega.slice(0, 10) : "",
      descripcion: pres.descripcion || "",
    });

    setIsMainModalOpen(true);
  };

  // Guardar
  const handleSavePresupuesto = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validaciones mínimas
    if (!presupuestoForm.nombreObra.trim()) {
      setErrorMsg("El campo 'Nombre Obra' es obligatorio.");
      return;
    }
    if (!presupuestoForm.cliente) {
      setErrorMsg("Debes seleccionar (o crear) un Cliente.");
      return;
    }
    if (!presupuestoForm.direccion.trim()) {
      setErrorMsg("El campo 'Dirección' es obligatorio.");
      return;
    }

    try {
      const method = editingPresupuesto ? "PUT" : "POST";
      const url = editingPresupuesto
        ? `${API_URL}/api/presupuestos/${editingPresupuesto._id}`
        : `${API_URL}/api/presupuestos`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(presupuestoForm),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (err) {
          errorData = { message: "Error desconocido en el servidor" };
        }
        console.error("Server error details:", errorData);
        throw new Error(errorData.message || "Error al crear/actualizar presupuesto");
      }

      const data = await res.json();
      if (editingPresupuesto) {
        setPresupuestos(
          presupuestos.map((p) => (p._id === data._id ? data : p))
        );
        setSuccessMsg("Presupuesto actualizado correctamente.");
      } else {
        setPresupuestos([...presupuestos, data]);
        setSuccessMsg("Presupuesto creado correctamente.");
      }

      setIsMainModalOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este presupuesto?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_URL}/api/presupuestos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (err) {
          errorData = { message: "Error desconocido en el servidor" };
        }
        console.error("Server error details:", errorData);
        throw new Error(errorData.message || "Error al eliminar presupuesto");
      }
      setPresupuestos(presupuestos.filter((p) => p._id !== id));
      setSuccessMsg("Presupuesto eliminado correctamente.");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  // Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPresupuestoForm({ ...presupuestoForm, [name]: value });
  };

  // Cargar Obra
  const handleOpenCargarObra = (pres) => {
    setErrorMsg("");
    setSuccessMsg("");

    setObraForm({
      nombre: pres.nombreObra || "",
      direccion: pres.direccion || "",
      fechaEntrega: pres.fechaEntrega ? pres.fechaEntrega.slice(0, 10) : "",
      contacto:
        typeof pres.cliente === "object" && pres.cliente
          ? `${pres.cliente.nombre} ${pres.cliente.apellido}`
          : pres.cliente || "",
    });
    setIsObraModalOpen(true);
  };

  const handleSaveObra = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!obraForm.nombre.trim()) {
      setErrorMsg("El campo 'Nombre Obra' es obligatorio al crear la Obra.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obraForm),
      });
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (err) {
          errorData = { message: "Error desconocido en el servidor" };
        }
        console.error("Server error details:", errorData);
        throw new Error(errorData.message || "Error al crear Obra");
      }
      await res.json();
      setSuccessMsg("Obra creada con éxito");
      setIsObraModalOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  const handleObraInputChange = (e) => {
    const { name, value } = e.target;
    setObraForm({ ...obraForm, [name]: value });
  };

  // Nuevo Cliente
  const handleOpenClienteCreateModal = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setClienteForm({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
    });
    setIsClienteModalOpen(true);
  };

  const handleClienteFormChange = (e) => {
    const { name, value } = e.target;
    setClienteForm({ ...clienteForm, [name]: value });
  };

  const handleSaveCliente = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!clienteForm.nombre.trim()) {
      setErrorMsg("El campo 'Nombre' del Cliente es obligatorio.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clienteForm),
      });
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (err) {
          errorData = { message: "Error desconocido en el servidor" };
        }
        console.error("Server error details:", errorData);
        throw new Error(errorData.message || "Error al crear cliente");
      }
      const newCliente = await res.json();
      setClientes([...clientes, newCliente]);
      // Asignar al presupuesto
      setPresupuestoForm((prev) => ({ ...prev, cliente: newCliente._id }));
      setSuccessMsg("Cliente creado con éxito");
      setIsClienteModalOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  // Calcula totalPresupuestado
  useEffect(() => {
    const cf = parseFloat(presupuestoForm.totalConFactura) || 0;
    const sf = parseFloat(presupuestoForm.totalSinFactura) || 0;
    setPresupuestoForm((prev) => ({
      ...prev,
      totalPresupuestado: cf + sf,
    }));
  }, [presupuestoForm.totalConFactura, presupuestoForm.totalSinFactura]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "aprobado":
        return "green";
      case "perdido":
        return "gray";
      default:
        return "gold"; // pendiente
    }
  };

  return (
    <div className="page-contenedor">
      <h1>Presupuestos</h1>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      {/* Filtro */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Filtrar por nombre de obra..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleOpenCreate}>+ Nuevo Presupuesto</button>
      </div>

      {/* Listado */}
      <div className="presupuestos-list">
        {filteredPresupuestos.map((pres) => (
          <div key={pres._id} className="presupuesto-card">
            <div className="presupuesto-header">
              {/* Muestra idPresupuesto auto-generado si quieres */}
              <h2>
                {pres.idPresupuesto ? `#${pres.idPresupuesto} - ` : ""}
                {pres.nombreObra}
              </h2>
              <span style={{ color: getEstadoColor(pres.estado), fontWeight: "bold" }}>
                {pres.estado}
              </span>
            </div>
            <div className="presupuesto-info">
              <p>
                <strong>Cliente:</strong>{" "}
                {typeof pres.cliente === "object" && pres.cliente
                  ? `${pres.cliente.nombre} ${pres.cliente.apellido}`
                  : pres.cliente}
              </p>
            </div>
            <div className="presupuesto-footer">
              <button onClick={() => handleOpenEdit(pres)}>Editar</button>
              <button onClick={() => handleDelete(pres._id)}>Eliminar</button>
              <button onClick={() => handleOpenCargarObra(pres)}>Cargar Obra</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal principal */}
      <ModalBase
        isOpen={isMainModalOpen}
        onClose={() => setIsMainModalOpen(false)}
        title={editingPresupuesto ? "Editar Presupuesto" : "Nuevo Presupuesto"}
      >
        <form onSubmit={handleSavePresupuesto}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre Obra</label>
              <input
                type="text"
                name="nombreObra"
                value={presupuestoForm.nombreObra}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Cliente</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  name="cliente"
                  value={presupuestoForm.cliente}
                  onChange={handleInputChange}
                >
                  <option value="">-- Seleccionar --</option>
                  {clientes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleOpenClienteCreateModal}>
                  + Nuevo
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select
                name="estado"
                value={presupuestoForm.estado}
                onChange={handleInputChange}
              >
                <option value="pendiente">pendiente</option>
                <option value="aprobado">aprobado</option>
                <option value="perdido">perdido</option>
              </select>
            </div>

            {presupuestoForm.estado === "perdido" && (
              <div className="form-group">
                <label>Empresa contra la que se perdió</label>
                <input
                  type="text"
                  name="empresaPerdida"
                  value={presupuestoForm.empresaPerdida}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="form-group">
              <label>Total c/F</label>
              <input
                type="number"
                name="totalConFactura"
                value={presupuestoForm.totalConFactura}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Total s/F</label>
              <input
                type="number"
                name="totalSinFactura"
                value={presupuestoForm.totalSinFactura}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Total Presupuestado</label>
              <input
                type="number"
                value={presupuestoForm.totalPresupuestado}
                disabled
              />
            </div>

            <div className="form-group col-span-2">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={presupuestoForm.direccion}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha de Entrega</label>
              <input
                type="date"
                name="fechaEntrega"
                value={presupuestoForm.fechaEntrega}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group col-span-2">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={presupuestoForm.descripcion}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}
          {successMsg && <p style={{ color: "green", marginTop: "1rem" }}>{successMsg}</p>}

          <div className="form-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setIsMainModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>

      {/* Sub-modal para Cargar Obra */}
      <ModalBase
        isOpen={isObraModalOpen}
        onClose={() => setIsObraModalOpen(false)}
        title="Cargar Obra desde Presupuesto"
      >
        <form onSubmit={handleSaveObra}>
          <div className="form-group">
            <label>Nombre Obra</label>
            <input
              type="text"
              name="nombre"
              value={obraForm.nombre}
              onChange={handleObraInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={obraForm.direccion}
              onChange={handleObraInputChange}
            />
          </div>
          <div className="form-group">
            <label>Fecha Entrega</label>
            <input
              type="date"
              name="fechaEntrega"
              value={obraForm.fechaEntrega}
              onChange={handleObraInputChange}
            />
          </div>
          <div className="form-group">
            <label>Contacto</label>
            <input
              type="text"
              name="contacto"
              value={obraForm.contacto}
              onChange={handleObraInputChange}
            />
          </div>

          {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}
          {successMsg && <p style={{ color: "green", marginTop: "1rem" }}>{successMsg}</p>}

          <div className="form-actions">
            <button type="submit">Crear Obra</button>
            <button type="button" onClick={() => setIsObraModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>

      {/* Sub-modal para crear Cliente */}
      <ModalBase
        isOpen={isClienteModalOpen}
        onClose={() => setIsClienteModalOpen(false)}
        title="Nuevo Cliente"
      >
        <form onSubmit={handleSaveCliente}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={clienteForm.nombre}
              onChange={handleClienteFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={clienteForm.apellido}
              onChange={handleClienteFormChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={clienteForm.email}
              onChange={handleClienteFormChange}
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={clienteForm.telefono}
              onChange={handleClienteFormChange}
            />
          </div>

          {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}
          {successMsg && <p style={{ color: "green", marginTop: "1rem" }}>{successMsg}</p>}

          <div className="form-actions">
            <button type="submit">Crear</button>
            <button type="button" onClick={() => setIsClienteModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>
    </div>
  );
}
