// src/pages/Panol.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";

const Panol = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [materiales, setMateriales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nuevoMaterial, setNuevoMaterial] = useState({
    nombre: "",
    cantidad: 0,
    unidad: "",
  });

  useEffect(() => {
    const fetchPanol = async () => {
      try {
        const res = await fetch(`${API_URL}/api/panol`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener pañol");
        const data = await res.json();
        // data podría ser un array de materiales o un objeto con arrays
        setMateriales(data.materiales || data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPanol();
  }, [API_URL]);

  const handleInputChange = (e) => {
    setNuevoMaterial({ ...nuevoMaterial, [e.target.name]: e.target.value });
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/panol`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoMaterial),
      });
      if (!res.ok) throw new Error("Error al agregar material");
      const data = await res.json();
      setMateriales([...materiales, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
   
      <div className="page-contenedor">
        <h1>Pañol</h1>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Agregar Material
        </button>

        <div className="list">
          {materiales.map((m, i) => (
            <div key={i} className="list-item">
              <h3>{m.nombre}</h3>
              <p>
                <strong>Cantidad:</strong> {m.cantidad} {m.unidad}
              </p>
            </div>
          ))}
        </div>

        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Material"
        >
          <form onSubmit={handleCreateMaterial}>
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
              <label>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Unidad</label>
              <input type="text" name="unidad" onChange={handleInputChange} />
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

export default Panol;
