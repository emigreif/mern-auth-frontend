import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "../components/ModalBase.jsx";
import "../styles/Pañol.css";

const Panol = () => {
  const [materiales, setMateriales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ nombre: "", cantidad: "", unidad: "" });
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/panol`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setMateriales(data))
        .catch((error) => console.error("Error fetching materiales:", error));
    }
  }, [API_URL, user]);

  const handleInputChange = (e) => {
    setNewMaterial({ ...newMaterial, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/panol`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(newMaterial),
      });

      if (!res.ok) throw new Error("Error al agregar material");

      const data = await res.json();
      setMateriales([...materiales, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Pañol</h1>
        <button onClick={() => setIsModalOpen(true)}>Agregar Material</button>

        <div className="materiales-list">
          {materiales.length === 0 ? (
            <p>No hay materiales registrados.</p>
          ) : (
            materiales.map((m) => (
              <div key={m._id} className="material-card">
                <h2>{m.nombre}</h2>
                <p><strong>Cantidad:</strong> {m.cantidad} {m.unidad}</p>

                <div className="action-buttons">
                  <button className="edit-button">✏️ Editar</button>
                  <button className="delete-button">❌ Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para agregar material */}
      <ModalBase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Agregar Material</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={newMaterial.nombre} onChange={handleInputChange} required />

          <label>Cantidad:</label>
          <input type="number" name="cantidad" value={newMaterial.cantidad} onChange={handleInputChange} required />

          <label>Unidad:</label>
          <input type="text" name="unidad" value={newMaterial.unidad} onChange={handleInputChange} required />

          <button type="submit">Guardar</button>
        </form>
      </ModalBase>
    </div>
  );
};

export default Panol;
