// src/pages/Obras.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Obras = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Lista de obras y estado de fetch
  const [obras, setObras] = useState([]);
  // Para filtrar
  const [searchTerm, setSearchTerm] = useState("");

  // Para el modal (crear/editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObra, setEditingObra] = useState(null); // null => creando, objeto => editando

  // Campos para la obra en el form
  const [obraForm, setObraForm] = useState({
    nombre: "",
    cliente: "",
    direccion: "",
    fechaEntrega: "",
    contacto: "",
    // etc. Los campos que quieras
  });

  // 1. Cargar obras al montar (si hay token)
  useEffect(() => {
    if (!token) return;
    fetchObras();
  }, [token]);

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

  // 2. Manejo del form (crear/editar)
  const handleInputChange = (e) => {
    setObraForm({ ...obraForm, [e.target.name]: e.target.value });
  };

  // 3. Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingObra(null);
    setObraForm({
      nombre: "",
      cliente: "",
      direccion: "",
      fechaEntrega: "",
      contacto: "",
      // ...
    });
    setIsModalOpen(true);
  };

  // 4. Abrir modal para editar
  const handleOpenEdit = (obra) => {
    setEditingObra(obra);
    setObraForm({
      nombre: obra.nombre || "",
      cliente: obra.cliente || "",
      direccion: obra.direccion || "",
      fechaEntrega: obra.fechaEntrega ? obra.fechaEntrega.slice(0,10) : "",
      contacto: obra.contacto || "",
      // ...
    });
    setIsModalOpen(true);
  };

  // 5. Guardar (POST/PUT)
  const handleSaveObra = async (e) => {
    e.preventDefault();
    try {
      if (editingObra) {
        // EDIT => PUT /api/obras/:id
        const res = await fetch(`${API_URL}/api/obras/${editingObra._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(obraForm),
        });
        if (!res.ok) throw new Error("Error al editar obra");
        const updated = await res.json();
        // Actualizar en el array
        setObras(obras.map(o => o._id === updated._id ? updated : o));
      } else {
        // CREATE => POST /api/obras
        const res = await fetch(`${API_URL}/api/obras`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(obraForm),
        });
        if (!res.ok) throw new Error("Error al crear obra");
        const newObra = await res.json();
        setObras([...obras, newObra]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving obra:", error);
    }
  };

  // 6. Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta obra?")) return;
    try {
      const res = await fetch(`${API_URL}/api/obras/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al eliminar obra");
      setObras(obras.filter(o => o._id !== id));
    } catch (error) {
      console.error("Error deleting obra:", error);
    }
  };

  // 7. Filtrado
  const filteredObras = obras.filter(o =>
    o.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.cliente && o.cliente.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-contenedor">
      <h1>Obras</h1>

      {/* Filtro */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Filtrar por nombre o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleOpenCreate}>+ Agregar Obra</button>
      </div>

      {/* Listado de tarjetas */}
      <div className="obra-list">
        {filteredObras.map((obra) => (
          <div key={obra._id} className="obra-card">
            {/* Header con codigoObra y nombre */}
            <div className="obra-card-header">
              <h2>
                {obra.codigoObra} - {obra.nombre}
              </h2>
              <span className="obra-entrega">
                Entrega: {obra.fechaEntrega ? obra.fechaEntrega.slice(0,10) : "Sin definir"}
              </span>
            </div>

            {/* Info principal */}
            <div className="obra-card-info">
              <p><strong>{obra.direccion}</strong></p>
              <p>{obra.cliente} - {obra.contacto}</p>
            </div>

            {/* Estados */}
            <div className="obra-card-estados">
              <span className={`estado-tag ${obra.estado?.perfiles || "pendiente"}`}>PERFILES</span>
              <span className={`estado-tag ${obra.estado?.vidrios || "pendiente"}`}>VIDRIOS</span>
              <span className={`estado-tag ${obra.estado?.accesorios || "pendiente"}`}>ACCESORIOS</span>
              <span className={`estado-tag ${obra.estado?.medicion || "pendiente"}`}>MEDICIÓN</span>
              <span className={`estado-tag ${obra.estado?.aprobada || "pendiente"}`}>OP APROBADA CLIENTE</span>
            </div>

            {/* Footer: saldo + botones */}
            <div className="obra-card-footer">
              <span className="obra-saldo">{obra.saldo}</span>
              <div className="obra-card-actions">
                <button onClick={() => handleOpenEdit(obra)}>Editar</button>
                <button onClick={() => handleDelete(obra._id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear/Editar */}
      <ModalBase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingObra ? "Editar Obra" : "Nueva Obra"}>
        <form onSubmit={handleSaveObra}>
          {/* codigoObra => no editable, solo mostrar si editing */}
          {editingObra && (
            <div className="form-group">
              <label>Código de Obra</label>
              <input type="text" value={editingObra.codigoObra} disabled />
            </div>
          )}

          <div className="form-group">
            <label>Nombre de la Obra</label>
            <input
              type="text"
              name="nombre"
              value={obraForm.nombre}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Cliente</label>
            <input
              type="text"
              name="cliente"
              value={obraForm.cliente}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={obraForm.direccion}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha de Entrega</label>
            <input
              type="date"
              name="fechaEntrega"
              value={obraForm.fechaEntrega}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Contacto</label>
            <input
              type="text"
              name="contacto"
              value={obraForm.contacto}
              onChange={handleInputChange}
            />
          </div>

          {/* Agrega más campos si quieres (importeConFactura, etc.) */}

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
    </div>
  );
};

export default Obras;
