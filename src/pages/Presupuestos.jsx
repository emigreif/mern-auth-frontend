// src/pages/Presupuestos.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";

const Presupuestos = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [presupuestos, setPresupuestos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newPresupuesto, setNewPresupuesto] = useState({
    nombreObra: "",
    cliente: "",
    estado: "pendiente",
    direccion: "",
    totalPresupuestado: 0,
  });

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/presupuestos`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener presupuestos");
        const data = await res.json();
        setPresupuestos(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPresupuestos();
  }, [API_URL]);

  const handleInputChange = (e) => {
    setNewPresupuesto({ ...newPresupuesto, [e.target.name]: e.target.value });
  };

  const handleCreatePresupuesto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/presupuestos`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPresupuesto),
      });
      if (!res.ok) throw new Error("Error al crear presupuesto");
      const data = await res.json();
      setPresupuestos([...presupuestos, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
      <div className="page-contenedor">
        <h1>Presupuestos</h1>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Agregar Presupuesto
        </button>

        <div className="list">
          {presupuestos.map((p) => (
            <div key={p._id} className="list-item">
              <h2>{p.nombreObra}</h2>
              <p>
                <strong>Cliente:</strong> {p.cliente}
              </p>
              <p>
                <strong>Estado:</strong> {p.estado}
              </p>
              <p>
                <strong>Dirección:</strong> {p.direccion}
              </p>
              <p>
                <strong>Total:</strong> {p.totalPresupuestado}
              </p>
            </div>
          ))}
        </div>

        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Presupuesto"
        >
          <form onSubmit={handleCreatePresupuesto}>
            <div className="form-group">
              <label>Nombre de la Obra</label>
              <input
                type="text"
                name="nombreObra"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Cliente</label>
              <input
                type="text"
                name="cliente"
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
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select name="estado" onChange={handleInputChange}>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="perdido">Perdido</option>
              </select>
            </div>
            <div className="form-group">
              <label>Total Presupuestado</label>
              <input
                type="number"
                name="totalPresupuestado"
                onChange={handleInputChange}
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
      </div>
   
  );
};

export default Presupuestos;
