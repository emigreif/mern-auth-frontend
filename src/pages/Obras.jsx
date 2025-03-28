// src/pages/Obras.jsx
import React, { useState, useEffect } from "react";
import styles from "../styles/pages/GlobalStylePages.module.css";
import { useAuth } from "../context/AuthContext.jsx";
import ModalObra from "../components/ModalObra.jsx";
import Button from "../components/Button.jsx";

export default function Obras() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [obras, setObras] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Para modal de creación/edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObra, setEditingObra] = useState(null);

  useEffect(() => {
    if (token) {
      fetchObras();
    }
  }, [token]);

  const fetchObras = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al obtener obras");
      }
      const data = await res.json();
      setObras(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingObra(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (obra) => {
    setEditingObra(obra);
    setIsModalOpen(true);
  };

  const handleCloseModal = (reload = false) => {
    setIsModalOpen(false);
    setEditingObra(null);
    if (reload) fetchObras();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta obra?")) return;
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/obras/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al eliminar obra");
      }
      fetchObras();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Obras</h1>
        <Button onClick={handleOpenCreate} className={styles.newObraBtn}>
          + Agregar Obra
        </Button>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando obras...</div>}
      {!loading && obras.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay obras para mostrar</div>
      )}

      {!loading && obras.length > 0 && (
        <table className={styles.obrasTable}>
          <thead>
            <tr>
              <th>Código Obra</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Contacto</th>
              <th>Fecha Entrega</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obras.map((o) => (
              <tr key={o._id}>
                <td>{o.codigoObra}</td>
                <td>{o.nombre}</td>
                <td>{o.direccion}</td>
                <td>{o.contacto}</td>
                <td>{o.fechaEntrega ? new Date(o.fechaEntrega).toLocaleDateString() : ""}</td>
                <td>
                  <Button onClick={() => handleOpenEdit(o)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(o._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <ModalObra obra={editingObra} onClose={handleCloseModal} onSaved={handleCloseModal} />
      )}
    </div>
  );
}
