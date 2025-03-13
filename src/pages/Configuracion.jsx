// src/pages/Configuracion.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Configuracion() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [config, setConfig] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (token) {
      fetchConfig();
    }
  }, [token]);

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/api/configuracion`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener configuración");
      const data = await res.json();
      setConfig(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleSave = async () => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      const res = await fetch(`${API_URL}/api/configuracion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          impuestos: config.impuestos,
          indicesActualizacion: config.indicesActualizacion,
        }),
      });
      if (!res.ok) throw new Error("Error al actualizar configuración");
      const data = await res.json();
      setConfig(data);
      setSuccessMsg("Configuración actualizada con éxito");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Funciones para manejar los arrays
  const handleImpuestoChange = (index, field, value) => {
    const newImpuestos = [...config.impuestos];
    newImpuestos[index] = { ...newImpuestos[index], [field]: value };
    setConfig({ ...config, impuestos: newImpuestos });
  };

  const addImpuesto = () => {
    setConfig({
      ...config,
      impuestos: [...config.impuestos, { codigo: "", descripcion: "", porcentaje: 0 }],
    });
  };

  const removeImpuesto = (index) => {
    const newImpuestos = [...config.impuestos];
    newImpuestos.splice(index, 1);
    setConfig({ ...config, impuestos: newImpuestos });
  };

  const handleIndiceChange = (index, field, value) => {
    const newIndices = [...config.indicesActualizacion];
    newIndices[index] = { ...newIndices[index], [field]: value };
    setConfig({ ...config, indicesActualizacion: newIndices });
  };

  const addIndice = () => {
    setConfig({
      ...config,
      indicesActualizacion: [...config.indicesActualizacion, { codigo: "", descripcion: "", valorActual: 0 }],
    });
  };

  const removeIndice = (index) => {
    const newIndices = [...config.indicesActualizacion];
    newIndices.splice(index, 1);
    setConfig({ ...config, indicesActualizacion: newIndices });
  };

  if (!config) return <div>Cargando configuración...</div>;

  return (
    <div className="page-contenedor">
      <h1>Configuración</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      <h2>Impuestos</h2>
      {config.impuestos.map((imp, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "0.5rem", marginBottom: "0.5rem" }}>
          <label>Código:</label>
          <input
            type="text"
            value={imp.codigo}
            onChange={(e) => handleImpuestoChange(i, "codigo", e.target.value)}
          />
          <label>Descripción:</label>
          <input
            type="text"
            value={imp.descripcion || ""}
            onChange={(e) => handleImpuestoChange(i, "descripcion", e.target.value)}
          />
          <label>Porcentaje:</label>
          <input
            type="number"
            value={imp.porcentaje}
            onChange={(e) => handleImpuestoChange(i, "porcentaje", parseFloat(e.target.value))}
          />
          <button onClick={() => removeImpuesto(i)}>Eliminar</button>
        </div>
      ))}
      <button onClick={addImpuesto}>+ Agregar Impuesto</button>

      <h2 style={{ marginTop: "2rem" }}>Índices de Actualización</h2>
      {config.indicesActualizacion.map((ind, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: "0.5rem", marginBottom: "0.5rem" }}>
          <label>Código:</label>
          <input
            type="text"
            value={ind.codigo}
            onChange={(e) => handleIndiceChange(i, "codigo", e.target.value)}
          />
          <label>Descripción:</label>
          <input
            type="text"
            value={ind.descripcion || ""}
            onChange={(e) => handleIndiceChange(i, "descripcion", e.target.value)}
          />
          <label>Valor Actual:</label>
          <input
            type="number"
            value={ind.valorActual}
            onChange={(e) => handleIndiceChange(i, "valorActual", parseFloat(e.target.value))}
          />
          <button onClick={() => removeIndice(i)}>Eliminar</button>
        </div>
      ))}
      <button onClick={addIndice}>+ Agregar Índice</button>

      <br />
      <button onClick={handleSave} style={{ marginTop: "1rem" }}>
        Guardar Configuración
      </button>
    </div>
  );
}
