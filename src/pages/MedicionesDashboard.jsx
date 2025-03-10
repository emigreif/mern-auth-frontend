import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "../components/ModalBase.jsx";
import "../styles/MedicionesDashboard.css";

const MedicionesDashboard = () => {
  const [mediciones, setMediciones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaMedicion, setNuevaMedicion] = useState({ nombre: "", fecha: "", resultado: "" });
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/mediciones`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setMediciones(data))
        .catch((error) => console.error("Error fetching mediciones:", error));
    }
  }, [API_URL, user]);

  const handleInputChange = (e) => {
    setNuevaMedicion({ ...nuevaMedicion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/mediciones`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(nuevaMedicion),
      });

      if (!res.ok) throw new Error("Error al agregar medición");

      const data = await res.json();
      setMediciones([...mediciones, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding medición:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Mediciones</h1>
        <button onClick={() => setIsModalOpen(true)}>Agregar Medición</button>

        <div className="mediciones-list">
          {mediciones.length === 0 ? (
            <p>No hay mediciones registradas.</p>
          ) : (
            mediciones.map((m) => (
              <div key={m._id} className="medicion-card">
                <h2>{m.nombre}</h2>
                <p><strong>Fecha:</strong> {m.fecha}</p>
                <p><strong>Resultado:</strong> {m.resultado}</p>

                <div className="action-buttons">
                  <button className="edit-button">✏️ Editar</button>
                  <button className="delete-button">❌ Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para agregar medición */}
      <ModalBase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Agregar Medición</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={nuevaMedicion.nombre} onChange={handleInputChange} required />

          <label>Fecha:</label>
          <input type="date" name="fecha" value={nuevaMedicion.fecha} onChange={handleInputChange} required />

          <label>Resultado:</label>
          <input type="text" name="resultado" value={nuevaMedicion.resultado} onChange={handleInputChange} required />

          <button type="submit">Guardar</button>
        </form>
      </ModalBase>
    </div>
  );
};

export default MedicionesDashboard;
