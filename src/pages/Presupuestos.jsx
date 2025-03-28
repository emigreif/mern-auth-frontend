// src/pages/Presupuestos.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";
import ModalPresupuesto from "../components/ModalPresupuesto.jsx";
import ModalObra from "../components/ModalObra.jsx";
import Button from "../components/Button.jsx";

export default function Presupuestos() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
      const data = await res.json();
      setPresupuestos(data);
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
      const data = await res.json();
      setClientes(data);
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
    if (!window.confirm("¿Seguro que deseas eliminar este presupuesto?"))
      return;
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

  const handlePasarAObra = (pres) => {
    setObraForm({
      nombre: pres.nombreObra || "",
      cliente: pres.cliente?._id || "",
      direccion: pres.direccion || "",
      fechaEntrega: pres.fechaEntrega || "",
    });
    setIsObraModalOpen(true);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Presupuestos</h1>
        <Button onClick={handleOpenCreate}>+ Nuevo Presupuesto</Button>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && (
        <div className={styles.spinner}>Cargando presupuestos...</div>
      )}
      {!loading && presupuestos.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay presupuestos para mostrar</div>
      )}
      {!loading && presupuestos.length > 0 && (
        <div>
          {presupuestos.map((pres) => (
            <div key={pres._id}>
              <div className={styles.header}>
                <h2>
                  {pres.idPresupuesto ? `#${pres.idPresupuesto} - ` : ""}
                  {pres.nombreObra}
                </h2>
                <span className={`${styles.estado} ${styles[pres.estado]}`}>
                  {pres.estado}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "50px" }}>
                <p>
                  <strong>Cliente:</strong>{" "}
                  {pres.cliente?.nombre || "Sin cliente"}
                </p>
                <p>
                  <strong>Dirección:</strong> {pres.direccion}
                </p>
                
                <p>
                  <strong>Total Presupuestado:</strong> $
                  {pres.totalPresupuestado || 0}
                </p>
                <p>
                  <strong>Fecha Entrega:</strong>{" "}
                  {pres.fechaEntrega
                    ? new Date(pres.fechaEntrega).toLocaleDateString()
                    : "N/D"}
                </p>
                
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end" }}>

                <Button onClick={() => handleOpenEdit(pres)}>✏️ Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(pres._id)}>
                  🗑️ Eliminar
                </Button>
                {pres.estado === "aprobado" && (
                  <Button onClick={() => handlePasarAObra(pres)}>
                    ➡️ Pasar a Obras
                  </Button>
                )}
              </div>
              <div style={{ borderTop: "1px solid #ccc", margin: "20px" }}></div>
            </div>
          ))}
        </div>
      )}

      {isPresupuestoModalOpen && (
        <ModalPresupuesto
          editingPresupuesto={editingPresupuesto}
          onClose={handleCloseModal}
          onSaved={handleCloseModal}
          clientes={clientes}
          onAddCliente={() => setIsClienteModalOpen(true)}
        />
      )}
      {isObraModalOpen && obraForm && (
        <ModalObra
          obra={obraForm}
          onClose={() => setIsObraModalOpen(false)}
          onSaved={() => {
            setIsObraModalOpen(false);
            fetchPresupuestos();
          }}
        />
      )}
    </div>
  );
}
