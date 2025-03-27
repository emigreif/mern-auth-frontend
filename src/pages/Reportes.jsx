// src/pages/Reportes.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "../components/ModalBase.jsx";
import styles from "../styles/pages/GlobalStylePages.css";

/**
 * Página "Reportes"
 * - GET /api/reportes => lista de reportes
 * - POST /api/reportes => crear un reporte
 * - Muestra spinner, error, no data
 */
const Reportes = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [reportes, setReportes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nuevoReporte, setNuevoReporte] = useState({
    categoria: "",
    descripcion: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchReportes();
    }
  }, [token]);

  const fetchReportes = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/reportes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al obtener reportes");
      }
      const data = await res.json();
      setReportes(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNuevoReporte({ ...nuevoReporte, [e.target.name]: e.target.value });
  };

  const handleCreateReporte = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/reportes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoReporte)
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al crear reporte");
      }
      const created = await res.json();
      setReportes([...reportes, created]);
      setIsModalOpen(false);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Reportes</h1>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          + Agregar Reporte
        </button>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando reportes...</div>}

      {!loading && reportes.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay reportes para mostrar</div>
      )}

      {!loading && reportes.length > 0 && (
        <div className={styles.list}>
          {reportes.map((r) => (
            <div key={r._id} className={styles.listItem}>
              <h2>{r.categoria}</h2>
              <p>
                <strong>Descripción:</strong> {r.descripcion}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {r.fecha ? new Date(r.fecha).toLocaleDateString() : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear un reporte */}
      {isModalOpen && (
        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Reporte"
        >
          <form onSubmit={handleCreateReporte}>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

            <div className="form-group">
              <label>Categoría</label>
              <input
                type="text"
                name="categoria"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions" style={{ marginTop: "1rem" }}>
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
      )}
    </div>
  );
};

export default Reportes;
