// src/pages/Mediciones.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";

const Mediciones = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [mediciones, setMediciones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nuevaMedicion, setNuevaMedicion] = useState({
    ubicacion: "",
    anchoRelevado: 0,
    altoRelevado: 0,
    observaciones: "",
  });

  // GET /api/mediciones
  useEffect(() => {
    const fetchMediciones = async () => {
      try {
        const res = await fetch(`${API_URL}/api/mediciones`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener mediciones");
        const data = await res.json();
        setMediciones(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMediciones();
  }, [API_URL]);

  // Manejar inputs
  const handleInputChange = (e) => {
    setNuevaMedicion({ ...nuevaMedicion, [e.target.name]: e.target.value });
  };

  // POST /api/mediciones
  const handleCreateMedicion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/mediciones`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaMedicion),
      });
      if (!res.ok) throw new Error("Error al crear medición");
      const data = await res.json();
      setMediciones([...mediciones, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
   
      <div className="page-contenedor">
        <h1>Mediciones</h1>

        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Agregar Medición
        </button>

        <div className="list">
          {mediciones.map((m) => (
            <div key={m._id} className="list-item">
              <h2>Ubicación: {m.ubicacion}</h2>
              <p>
                <strong>Ancho:</strong> {m.anchoRelevado}
              </p>
              <p>
                <strong>Alto:</strong> {m.altoRelevado}
              </p>
              <p>
                <strong>Observaciones:</strong> {m.observaciones}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(m.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Medición"
        >
          <form onSubmit={handleCreateMedicion}>
            <div className="form-group">
              <label>Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ancho Relevado</label>
              <input
                type="number"
                name="anchoRelevado"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Alto Relevado</label>
              <input
                type="number"
                name="altoRelevado"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Observaciones</label>
              <textarea name="observaciones" onChange={handleInputChange} />
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

export default Mediciones;
