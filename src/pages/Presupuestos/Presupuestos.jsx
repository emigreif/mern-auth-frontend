// src/pages/Presupuestos.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Presupuestos.module.css";

// Se asume que hay un modal para crear/editar presupuesto
import ModalPresupuesto from "../../components/ModalPresupuesto/ModalPresupuesto.jsx";

/**
 * Página "Presupuestos"
 * - Lista de presupuestos (GET /api/presupuestos)
 * - Crear/editar (POST/PUT /api/presupuestos)
 * - Eliminar (DELETE /api/presupuestos/:id)
 * - Muestra spinner, error, no data
 */
export default function Presupuestos() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Lista de presupuestos
  const [presupuestos, setPresupuestos] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState(null);

  useEffect(() => {
    if (token) {
      fetchPresupuestos();
    }
  }, [token]);

  const fetchPresupuestos = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/presupuestos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al obtener presupuestos");
      }
      const data = await res.json();
      setPresupuestos(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPresupuesto(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pres) => {
    setEditingPresupuesto(pres);
    setIsModalOpen(true);
  };

  const handleCloseModal = (reload = false) => {
    setIsModalOpen(false);
    setEditingPresupuesto(null);
    if (reload) {
      fetchPresupuestos();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este presupuesto?")) return;
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/presupuestos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al eliminar presupuesto");
      }
      fetchPresupuestos();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Para asignar color a la etiqueta de estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case "aprobado":
        return styles.aprobado;
      case "perdido":
        return styles.perdido;
      default:
        return styles.pendiente;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Presupuestos</h1>
        <button className={styles.newPresupuestoBtn} onClick={handleOpenCreate}>
          + Nuevo Presupuesto
        </button>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando presupuestos...</div>}

      {!loading && presupuestos.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay presupuestos para mostrar</div>
      )}

      {!loading && presupuestos.length > 0 && (
        <div className={styles.presupuestosList}>
          {presupuestos.map((pres) => (
            <div key={pres._id} className={styles.presupuestoCard}>
              <div className={styles.presupuestoHeader}>
                <h2>
                  {pres.idPresupuesto ? `#${pres.idPresupuesto} - ` : ""}
                  {pres.nombreObra}
                </h2>
                <span className={`${styles.estado} ${getEstadoClass(pres.estado)}`}>
                  {pres.estado}
                </span>
              </div>

              <div className={styles.presupuestoInfo}>
                <p>
                  <strong>Cliente:</strong>{" "}
                  {pres.cliente
                    ? `${pres.cliente.nombre} ${pres.cliente.apellido}`
                    : "Sin cliente"}
                </p>
                <p>
                  <strong>Dirección:</strong> {pres.direccion}
                </p>
                <p>
                  <strong>Fecha Entrega:</strong>{" "}
                  {pres.fechaEntrega
                    ? new Date(pres.fechaEntrega).toLocaleDateString()
                    : "N/D"}
                </p>
                <p>
                  <strong>Total Presupuestado:</strong>{" "}
                  {pres.totalPresupuestado || 0}
                </p>
              </div>

              <div className={styles.presupuestoFooter}>
                <button
                  className={styles.actionBtn}
                  onClick={() => handleOpenEdit(pres)}
                >
                  Editar
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => handleDelete(pres._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear/editar */}
      {isModalOpen && (
        <ModalPresupuesto
          editingPresupuesto={editingPresupuesto}
          onClose={handleCloseModal}
          onSaved={handleCloseModal}
        />
      )}
    </div>
  );
}
