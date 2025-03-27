import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/pages/GlobalStylePages.module.css";

export default function Configuracion() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [config, setConfig] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
      impuestos: [...config.impuestos, { codigo: "", descripcion: "", porcentaje: 0 }],
    });
  };

  const removeImpuesto = (index) => {
    if (!config) return;
    const newImpuestos = [...config.impuestos];
    newImpuestos.splice(index, 1);
    setConfig({ ...config, impuestos: newImpuestos });
  };

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
      indicesActualizacion: [...config.indicesActualizacion, { codigo: "", descripcion: "", valorActual: 0 }],
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
      <header className={styles.header}>
        <h1>Configuración</h1>
        <nav className={styles.nav}>
          <Link to="profile" className={styles.navLink}>Mi Perfil</Link>
          <Link to="perfiles" className={styles.navLink}>Perfiles</Link>
        </nav>
      </header>

      <main className={styles.mainContent}>
        <Outlet />
        {loading && <p className={styles.spinner}>Cargando configuración...</p>}
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        {successMsg && <p className={styles.success}>{successMsg}</p>}
        {!loading && config && (
          <div className={styles.configSection}>
            <h2>Impuestos</h2>
            {config.impuestos.map((imp, i) => (
              <div key={i} className={styles.configItem}>
                <label className={styles.label}>Código:</label>
                <input
                  type="text"
                  value={imp.codigo}
                  onChange={(e) => handleImpuestoChange(i, "codigo", e.target.value)}
                  className={styles.input}
                />
                <label className={styles.label}>Descripción:</label>
                <input
                  type="text"
                  value={imp.descripcion || ""}
                  onChange={(e) => handleImpuestoChange(i, "descripcion", e.target.value)}
                  className={styles.input}
                />
                <label className={styles.label}>Porcentaje:</label>
                <input
                  type="number"
                  value={imp.porcentaje}
                  onChange={(e) => handleImpuestoChange(i, "porcentaje", parseFloat(e.target.value))}
                  className={styles.input}
                />
                <button
                  className={`${styles.btn} ${styles.deleteBtn}`}
                  onClick={() => removeImpuesto(i)}
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button className={`${styles.btn} ${styles.addBtn}`} onClick={addImpuesto}>
              + Agregar Impuesto
            </button>

            <h2>Índices de Actualización</h2>
            {config.indicesActualizacion.map((ind, i) => (
              <div key={i} className={styles.configItem}>
                <label className={styles.label}>Código:</label>
                <input
                  type="text"
                  value={ind.codigo}
                  onChange={(e) => handleIndiceChange(i, "codigo", e.target.value)}
                  className={styles.input}
                />
                <label className={styles.label}>Descripción:</label>
                <input
                  type="text"
                  value={ind.descripcion || ""}
                  onChange={(e) => handleIndiceChange(i, "descripcion", e.target.value)}
                  className={styles.input}
                />
                <label className={styles.label}>Valor Actual:</label>
                <input
                  type="number"
                  value={ind.valorActual}
                  onChange={(e) => handleIndiceChange(i, "valorActual", parseFloat(e.target.value))}
                  className={styles.input}
                />
                <button
                  className={`${styles.btn} ${styles.deleteBtn}`}
                  onClick={() => removeIndice(i)}
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button className={`${styles.btn} ${styles.addBtn}`} onClick={addIndice}>
              + Agregar Índice
            </button>

            <button className={`${styles.btn} ${styles.saveBtn}`} onClick={handleSave}>
              Guardar Configuración
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
