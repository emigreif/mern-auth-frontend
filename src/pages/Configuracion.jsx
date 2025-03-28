// src/pages/Configuracion/Configuracion.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";

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
        headers: { Authorization: `Bearer ${token}` },
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
        { codigo: "", descripcion: "", porcentaje: 0 },
      ],
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
        { codigo: "", descripcion: "", valorActual: 0 },
      ],
    });
  };

  const removeIndice = (index) => {
    if (!config) return;
    const newIndices = [...config.indicesActualizacion];
    newIndices.splice(index, 1);
    setConfig({ ...config, indicesActualizacion: newIndices });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Configuración</h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            color: "gray",
            gap: "50px",
          }}
        >
         <h3> <Link to="/profile">Mi Perfil</Link></h3>
         <h3>  <Link to="/perfiles">Perfiles</Link></h3>
        </div>
      </div>
      <Outlet />
      {loading && <p style={{ margin: "1rem 0" }}>Cargando configuración...</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {!loading && config && (
        <div>
          <div className={styles.header}>
            {" "}
            <h2>Impuestos</h2>{" "}
            <Button onClick={addImpuesto} style={{ marginTop: "0.5rem" }}>
              + Agregar Impuesto
            </Button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {config.impuestos.map((imp, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                  marginBottom: "0.5rem",
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
                <Button
                  variant="danger"
                  onClick={() => removeImpuesto(i)}
                  style={{ marginLeft: "1rem" }}
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
          <div className={styles.header}>
            <h2 style={{ marginTop: "2rem" }}>Índices de Actualización</h2>
            <Button onClick={addIndice} style={{ marginTop: "0.5rem" }}>
              + Agregar Índice
            </Button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {" "}
            {config.indicesActualizacion.map((ind, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                  marginBottom: "0.5rem",
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
                <Button
                  variant="danger"
                  onClick={() => removeIndice(i)}
                  style={{ marginLeft: "1rem" }}
                >
                  Eliminar
                </Button>
              </div>
            ))}{" "}
          </div>

          <Button
            onClick={handleSave}
            style={{ marginTop: "1rem", backgroundColor: "#00aa63" }}
          >
            Guardar Configuración
          </Button>
        </div>
      )}
    </div>
  );
}
