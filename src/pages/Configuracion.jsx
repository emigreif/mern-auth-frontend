// frontend/src/pages/Configuracion.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Configuracion = () => {
  const [config, setConfig] = useState(null);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/api/configuracion`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener configuración");
        const data = await res.json();
        setConfig(data);
      } catch (error) {
        console.error("Error fetching configuración:", error);
      }
    };

    if (user) {
      fetchConfig();
    }
  }, [API_URL, user]);

  const handleChange = (e, key, index) => {
    if (index !== undefined) {
      const updatedImpuestos = [...config.impuestos];
      updatedImpuestos[index][key] = e.target.value;
      setConfig({ ...config, impuestos: updatedImpuestos });
    } else {
      setConfig({ ...config, [key]: e.target.value });
    }
  };

  const saveConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/api/configuracion`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Error al actualizar configuración");
      alert("Configuración guardada con éxito!");
    } catch (error) {
      console.error("Error guardando configuración:", error);
    }
  };

  if (!config) return <div>Cargando configuración...</div>;

  return (
    <div className="configuracion-container">
      <h1>Configuración</h1>
      {/* Muestra y edita la configuración */}
      <div>
        <h2>Roles de Usuario</h2>
        <ul>
          {config.roles.map((role, idx) => <li key={idx}>{role}</li>)}
        </ul>
      </div>
      {/* Agregar secciones para índices, impuestos, etc. similar al código original */}
      <button onClick={saveConfig}>Guardar Configuración</button>
    </div>
  );
};

export default Configuracion;
