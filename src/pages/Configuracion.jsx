// src/pages/Configuracion/Configuracion.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import styles from "../styles/pages/Configuracion.module.css"


export default function Configuracion() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [config, setConfig] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Cargar configuración inicial
  useEffect(() => {
    if (token) {
      fetchConfig();
    }
  }, [token]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/configuracion`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener configuración");
      const data = await res.json();
      setConfig(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Guardar configuración
  const handleSave = async () => {
    if (!config) return;
    try {
      setErrorMsg("");
      setSuccessMsg("");
      setLoading(true);

      const res = await fetch(`${API_URL}/api/configuracion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          impuestos: config.impuestos,
          indicesActualizacion: config.indicesActualizacion
        })
      });
      if (!res.ok) throw new Error("Error al actualizar configuración");

      const data = await res.json();
      setConfig(data);
      setSuccessMsg("Configuración actualizada con éxito");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Manejo de impuestos
  const handleImpuestoChange = (index, field, value) => {
    if (!config) return;
    const newImpuestos = [...config.impuestos];
    newImpuestos[index] = { ...newImpuestos[index], [field]: value };
    setConfig({ ...config, impuestos: newImpuestos });
  };

  const addImpuesto = () => {
    if (!config) return;
    setConfig({
      ...config,
      impuestos: [
        ...config.impuestos,
        { codigo: "", descripcion: "", porcentaje: 0 }
      ]
    });
  };

  const removeImpuesto = (index) => {
    if (!config) return;
    const newImpuestos = [...config.impuestos];
    newImpuestos.splice(index, 1);
    setConfig({ ...config, impuestos: newImpuestos });
  };

  // 4. Manejo de índices de actualización
  const handleIndiceChange = (index, field, value) => {
    if (!config) return;
    const newIndices = [...config.indicesActualizacion];
    newIndices[index] = { ...newIndices[index], [field]: value };
    setConfig({ ...config, indicesActualizacion: newIndices });
  };

  const addIndice = () => {
    if (!config) return;
    setConfig({
      ...config,
      indicesActualizacion: [
        ...config.indicesActualizacion,
        { codigo: "", descripcion: "", valorActual: 0 }
      ]
    });
  };

  const removeIndice = (index) => {
    if (!config) return;
    const newIndices = [...config.indicesActualizacion];
    newIndices.splice(index, 1);
    setConfig({ ...config, indicesActualizacion: newIndices });
  };

  // Render principal
  return (
  <div className={styles.pageContainer}>
       <div className={styles.header}>
      <h1>Configuración</h1>

      {/* Menú para sub-rutas: /configuracion/profile, /configuracion/perfiles */}
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="profile" style={{ marginRight: "1rem" }}>
          Mi Perfil
        </Link>
        <Link to="perfiles">Perfiles</Link>
      </nav>

      {/* <Outlet /> => renderiza sub-rutas (Profile, Perfiles) */}
      <Outlet />

      {/* Sección de configuración principal (impuestos, índices) */}
      {loading && <p style={{ margin: "1rem 0" }}>Cargando configuración...</p>}

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      {!loading && config && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Impuestos</h2>
          {config.impuestos.map((imp, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                padding: "0.5rem",
                marginBottom: "0.5rem"
              }}
            >
              <label style={{ display: "block" }}>Código:</label>
              <input
                type="text"
                value={imp.codigo}
                onChange={(e) =>
                  handleImpuestoChange(i, "codigo", e.target.value)
                }
              />

              <label style={{ display: "block", marginTop: "0.3rem" }}>
                Descripción:
              </label>
              <input
                type="text"
                value={imp.descripcion || ""}
                onChange={(e) =>
                  handleImpuestoChange(i, "descripcion", e.target.value)
                }
              />

              <label style={{ display: "block", marginTop: "0.3rem" }}>
                Porcentaje:
              </label>
              <input
                type="number"
                value={imp.porcentaje}
                onChange={(e) =>
                  handleImpuestoChange(
                    i,
                    "porcentaje",
                    parseFloat(e.target.value)
                  )
                }
              />

              <button
                style={{
                  marginLeft: "1rem",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.3rem 0.6rem",
                  cursor: "pointer"
                }}
                onClick={() => removeImpuesto(i)}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            onClick={addImpuesto}
            style={{
              marginTop: "0.5rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.4rem 0.8rem",
              cursor: "pointer"
            }}
          >
            + Agregar Impuesto
          </button>

          <h2 style={{ marginTop: "2rem" }}>Índices de Actualización</h2>
          {config.indicesActualizacion.map((ind, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                padding: "0.5rem",
                marginBottom: "0.5rem"
              }}
            >
              <label style={{ display: "block" }}>Código:</label>
              <input
                type="text"
                value={ind.codigo}
                onChange={(e) =>
                  handleIndiceChange(i, "codigo", e.target.value)
                }
              />

              <label style={{ display: "block", marginTop: "0.3rem" }}>
                Descripción:
              </label>
              <input
                type="text"
                value={ind.descripcion || ""}
                onChange={(e) =>
                  handleIndiceChange(i, "descripcion", e.target.value)
                }
              />

              <label style={{ display: "block", marginTop: "0.3rem" }}>
                Valor Actual:
              </label>
              <input
                type="number"
                value={ind.valorActual}
                onChange={(e) =>
                  handleIndiceChange(
                    i,
                    "valorActual",
                    parseFloat(e.target.value)
                  )
                }
              />

              <button
                style={{
                  marginLeft: "1rem",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.3rem 0.6rem",
                  cursor: "pointer"
                }}
                onClick={() => removeIndice(i)}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            onClick={addIndice}
            style={{
              marginTop: "0.5rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.4rem 0.8rem",
              cursor: "pointer"
            }}
          >
            + Agregar Índice
          </button>

          <br />
          <button
            onClick={handleSave}
            style={{
              marginTop: "1rem",
              backgroundColor: "#00aa63",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.6rem 1rem",
              cursor: "pointer"
            }}
          >
            Guardar Configuración
          </button>
        </div>
      )}
    </div>
    </div>
  );
}
