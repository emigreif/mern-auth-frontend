// src/pages/Presupuestos.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Presupuestos.module.css";
import ModalPresupuesto from "../../components/ModalPresupuesto/ModalPresupuesto.jsx";
import ModalObra from "../../components/ModalObra/ModalObra.jsx";

export default function Presupuestos() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Estados principales
  const [presupuestos, setPresupuestos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Modales
  const [isPresupuestoModalOpen, setIsPresupuestoModalOpen] = useState(false);
  const [isObraModalOpen, setIsObraModalOpen] = useState(false);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);

  const [editingPresupuesto, setEditingPresupuesto] = useState(null);
  const [obraForm, setObraForm] = useState({});

  useEffect(() => {
    if (token) {
      fetchPresupuestos();
      fetchClientes();
    }
  }, [token]);

  const fetchPresupuestos = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/presupuestos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener presupuestos");
      setPresupuestos(await res.json());
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener clientes");
      setClientes(await res.json());
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  const handleOpenCreate = () => {
    setEditingPresupuesto(null);
    setIsPresupuestoModalOpen(true);
  };

  const handleOpenEdit = (pres) => {
    setEditingPresupuesto(pres);
    setIsPresupuestoModalOpen(true);
  };

  const handleCloseModal = (reload = false) => {
    setIsPresupuestoModalOpen(false);
    setEditingPresupuesto(null);
    if (reload) {
      fetchPresupuestos();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este presupuesto?")) return;
    try {
      const res = await fetch(`${API_URL}/api/presupuestos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar presupuesto");
      fetchPresupuestos();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleCreateCliente = async () => {
    setIsClienteModalOpen(false);
    fetchClientes();
  };

  const handlePasarAObra = (pres) => {
    setObraForm({
      nombre: pres.nombreObra || "",
      cliente: pres.cliente?._id || "",
      direccion: pres.direccion || "",
      fechaEntrega: pres.fechaEntrega || "", // ✅ Ahora se carga correctamente
    });
    setIsObraModalOpen(true);
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
                <span className={`${styles.estado} ${styles[pres.estado]}`}>
                  {pres.estado}
                </span>
              </div>

              <div className={styles.presupuestoInfo}>
                <p><strong>Cliente:</strong> {pres.cliente?.nombre || "Sin cliente"}</p>
                <p><strong>Dirección:</strong> {pres.direccion}</p>
                <p><strong>Fecha Entrega:</strong> {pres.fechaEntrega ? new Date(pres.fechaEntrega).toLocaleDateString() : "N/D"}</p>
                <p><strong>Total Presupuestado:</strong> ${pres.totalPresupuestado || 0}</p>
              </div>

              <div className={styles.presupuestoFooter}>
                <button className={styles.actionBtn} onClick={() => handleOpenEdit(pres)}>✏️ Editar</button>
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(pres._id)}>🗑️ Eliminar</button>
                
                {pres.estado === "aprobado" && (
                  <button className={styles.pasarObraBtn} onClick={() => handlePasarAObra(pres)}>
                    ➡️ Pasar a Obras
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear/editar presupuesto */}
      {isPresupuestoModalOpen && (
        <ModalPresupuesto
          editingPresupuesto={editingPresupuesto}
          onClose={handleCloseModal}
          onSaved={handleCloseModal}
          clientes={clientes} 
          onAddCliente={() => setIsClienteModalOpen(true)} // ✅ Llamar modal de nuevo cliente
        />
      )}

{isObraModalOpen && obraForm && (
  <ModalObra
    obra={obraForm} // ✅ Ahora pasamos obraForm, que sí está definido
    onClose={() => setIsObraModalOpen(false)}
    onSaved={() => {
      setIsObraModalOpen(false);
      fetchPresupuestos(); // 🔄 Recargar lista si se guarda
    }}
  />
)}


   
    </div>
  );
}
