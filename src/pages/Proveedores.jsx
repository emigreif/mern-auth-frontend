// src/pages/Proveedores.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";

const Proveedores = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [proveedores, setProveedores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: "",
    direccion: "",
    emails: "",
    telefono: "",
  });

  // Cargar lista de proveedores
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await fetch(`${API_URL}/api/proveedores`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener proveedores");
        const data = await res.json();
        setProveedores(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProveedores();
  }, [API_URL]);

  // Manejar inputs
  const handleInputChange = (e) => {
    setNuevoProveedor({ ...nuevoProveedor, [e.target.name]: e.target.value });
  };

  // Crear proveedor
  const handleCreateProveedor = async (e) => {
    e.preventDefault();
    try {
      // emails en el backend es un array, aquí lo parseamos
      const body = {
        ...nuevoProveedor,
        emails: nuevoProveedor.emails.split(",").map((mail) => mail.trim()),
      };

      const res = await fetch(`${API_URL}/api/proveedores`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error al crear proveedor");
      const data = await res.json();
      setProveedores([...proveedores, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
      <div className="page-contenedor">
        <h1>Proveedores</h1>

        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Agregar Proveedor
        </button>

        <div className="list">
          {proveedores.map((p) => (
            <div key={p._id} className="list-item">
              <h3>{p.nombre}</h3>
              <p>
                <strong>Dirección:</strong> {p.direccion}
              </p>
              <p>
                <strong>Emails:</strong> {p.emails?.join(", ")}
              </p>
              <p>
                <strong>Teléfono:</strong> {p.telefono}
              </p>
            </div>
          ))}
        </div>

        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Proveedor"
        >
          <form onSubmit={handleCreateProveedor}>
            <div className="form-group">
              <label>Nombre</label>
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
              <label>Emails (separados por coma)</label>
              <input type="text" name="emails" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input type="text" name="telefono" onChange={handleInputChange} />
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
    
};

export default Proveedores;
