// src/pages/Configuracion.jsx
import React, { useState, useEffect } from "react";

const Configuracion = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [config, setConfig] = useState({
    impuestos: [],
    costoHora: 0,
    indicesSaldo: 1.05,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/api/configuracion`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener configuración");
        const data = await res.json();
        // data[0] o algo similar, según tu backend
        if (data.length) setConfig(data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConfig();
  }, [API_URL]);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // PUT /api/configuracion/:id, si tu backend lo maneja así
      const res = await fetch(`${API_URL}/api/configuracion/${config._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Error al actualizar configuración");
      alert("Configuración guardada");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-contenedor">
      <h1>Configuración</h1>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Costo Hora</label>
          <input
            type="number"
            name="costoHora"
            value={config.costoHora}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Índice Saldo</label>
          <input
            type="number"
            step="0.01"
            name="indicesSaldo"
            value={config.indicesSaldo}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn">Guardar Configuración</button>
      </form>
    </div>
    
  );
};

export default Configuracion;
