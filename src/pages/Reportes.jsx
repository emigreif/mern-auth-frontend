// src/pages/Reportes.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";

const Reportes = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [reportes, setReportes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nuevoReporte, setNuevoReporte] = useState({
    categoria: "",
    descripcion: "",
  });

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reportes`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener reportes");
        const data = await res.json();
        setReportes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReportes();
  }, [API_URL]);

  const handleInputChange = (e) => {
    setNuevoReporte({ ...nuevoReporte, [e.target.name]: e.target.value });
  };

  const handleCreateReporte = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/reportes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoReporte),
      });
      if (!res.ok) throw new Error("Error al crear reporte");
      const data = await res.json();
      setReportes([...reportes, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Reportes</h1>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Agregar Reporte
        </button>

        <div className="list">
          {reportes.map((r) => (
            <div key={r._id} className="list-item">
              <h2>{r.categoria}</h2>
              <p>
                <strong>Descripción:</strong> {r.descripcion}
              </p>
              <p>
                <strong>Fecha:</strong> {r.fecha ? r.fecha.slice(0, 10) : ""}
              </p>
            </div>
          ))}
        </div>

        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Reporte"
        >
          <form onSubmit={handleCreateReporte}>
            <div className="form-group">
              <label>Categoría</label>
              <input
                type="text"
                name="categoria"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                onChange={handleInputChange}
                required
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
    </div>
  );
};

export default Reportes;
