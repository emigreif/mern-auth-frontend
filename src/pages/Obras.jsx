// src/pages/Obras.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Obras = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [obras, setObras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Campos para crear una nueva obra
  const [newObra, setNewObra] = useState({
    nombre: "",
    direccion: "",
    fechaEntrega: "",
    contacto: "",
    // ... otros campos si tu backend los requiere
  });

  // 1. Cargar la lista de obras (GET /api/obras)
  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener obras");
        const data = await res.json();
        setObras(data);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };
    fetchObras();
  }, [API_URL]);

  // 2. Manejo de inputs para crear obra
  const handleInputChange = (e) => {
    setNewObra({ ...newObra, [e.target.name]: e.target.value });
  };

  // 3. Crear obra (POST /api/obras)
  const handleCreateObra = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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

  return (
    
      <div className="page-contenedor">
        <h1>Obras</h1>

        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Agregar Obra
        </button>

        {/* Lista de obras con la estética “fila con estados” */}
        <div className="obra-list">
          {obras.map((obra) => (
            <div key={obra._id} className="obra-item">
              {/* Encabezado: ID y Nombre, Fecha de Entrega */}
              <div className="obra-header">
                <div className="obra-id-name">
                  <span className="obra-id">{obra.codigoObra}</span>
                  {" - "}
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

              {/* Fila de estados (perfiles, vidrios, etc.) */}
              <div className="obra-status-row">
                <span
                  className={`obra-status-step ${
                    obra.estado?.perfiles || "pending"
                  }`}
                >
                  PERFILES
                </span>
                <span
                  className={`obra-status-step ${
                    obra.estado?.vidrios || "pending"
                  }`}
                >
                  VIDRIOS
                </span>
                <span
                  className={`obra-status-step ${
                    obra.estado?.accesorios || "pending"
                  }`}
                >
                  ACCESORIOS
                </span>
                <span
                  className={`obra-status-step ${
                    obra.estado?.medicion || "pending"
                  }`}
                >
                  MEDICIÓN
                </span>
                <span
                  className={`obra-status-step ${
                    obra.estado?.aprobada || "pending"
                  }`}
                >
                  OP APROBADA CLIENTE
                </span>
                {/* etc. */}
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
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha de Entrega</label>
              <input
                type="date"
                name="fechaEntrega"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Contacto</label>
              <input type="text" name="contacto" onChange={handleInputChange} />
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
      </div>
    
  );
};

export default Obras;
