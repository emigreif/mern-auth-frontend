// src/pages/Compras.jsx
import React, { useEffect, useState } from "react";
import styles from "./Compras.module.css";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalCompra from "../../components/ModalCompra/ModalCompra.jsx";
import ModalIngresoMaterial from "../../components/ModalIngresoMaterial/ModalIngresoMaterial.jsx";

/**
 * Página "Compras"
 * - Lista de compras filtradas por tipo (aluminio, vidrios, accesorios, todas)
 * - Botón para crear nueva compra => ModalCompra
 * - Botón "Ingreso" => ModalIngresoMaterial
 * - Anular => marca la compra como "anulado"
 */
export default function Compras() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [tipo, setTipo] = useState("todas");
  const [compras, setCompras] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIngresoModalOpen, setIsIngresoModalOpen] = useState(false);
  const [editingCompra, setEditingCompra] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCompras();
    }
  }, [token, tipo]);

  const fetchCompras = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      let url = `${API_URL}/api/compras/${tipo}`;
      // "todas" => GET /api/compras/todas
      // "aluminio" => GET /api/compras/aluminio, etc.
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al obtener compras");
      }
      const data = await res.json();
      setCompras(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCompra(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (compra) => {
    setEditingCompra(compra);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompra(null);
    fetchCompras();
  };

  const handleOpenIngreso = (compra) => {
    setEditingCompra(compra);
    setIsIngresoModalOpen(true);
  };

  const handleCloseIngreso = () => {
    setIsIngresoModalOpen(false);
    setEditingCompra(null);
    fetchCompras();
  };

  const handleAnular = async (compraId) => {
    if (!confirm("¿Seguro que deseas anular esta orden de compra?")) return;
    try {
      const c = compras.find((x) => x._id === compraId);
      if (!c) return;

      // DELETE /api/compras/:tipo/:id
      // Se asume que anula la compra
      const url = `${API_URL}/api/compras/${c.tipo}/${compraId}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al anular la compra");
      }
      fetchCompras();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Semáforo (opcional)
  const getSemaforo = (compra) => {
    if (compra.estado === "anulado") return "🔴 Anulado";
    if (compra.estado === "completado") return "🟢 Completado";

    if (!compra.fechaEstimadaEntrega) return "🟡 Pendiente";
    const diasRestantes =
      (new Date(compra.fechaEstimadaEntrega) - new Date()) / (1000 * 60 * 60 * 24);
    if (diasRestantes < 0) return "🔴 Vencido";
    if (diasRestantes < 3) return "🟠 Próximo";
    return "🟡 Pendiente";
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Portal de Compras</h1>
        <div className={styles.filters}>
          <select
            className={styles.filterSelect}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="aluminio">Aluminio</option>
            <option value="vidrios">Vidrios</option>
            <option value="accesorios">Accesorios</option>
          </select>
          <button className={styles.newCompraBtn} onClick={handleOpenCreate}>
            + Nueva Compra
          </button>
        </div>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      {loading && <div className={styles.spinner}>Cargando compras...</div>}

      {!loading && compras.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay compras para mostrar</div>
      )}

      {!loading && compras.length > 0 && (
        <table className={styles.tableBase}>
          <thead>
            <tr>
              <th>OC #</th>
              <th>Cód. Obra</th>
              <th>Obra</th>
              <th>Tipo</th>
              <th>Proveedor</th>
              <th>Estado</th>
              <th>Semáforo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((c) => (
              <tr key={c._id}>
                <td>{c.numeroOC}</td>
                <td>{c.obra?.codigoObra}</td>
                <td>{c.obra?.nombre}</td>
                <td>{c.tipo}</td>
                <td>{c.proveedor?.nombre}</td>
                <td>{c.estado}</td>
                <td>{getSemaforo(c)}</td>
                <td>
                  {c.estado !== "anulado" && c.estado !== "completado" && (
                    <>
                      <button
                        className={styles.actionsBtn}
                        onClick={() => handleOpenEdit(c)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.actionsBtn}
                        onClick={() => handleOpenIngreso(c)}
                      >
                        Ingreso
                      </button>
                      <button
                        className={`${styles.actionsBtn} ${styles.anularBtn}`}
                        onClick={() => handleAnular(c._id)}
                      >
                        Anular
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de Nueva/Editar Compra */}
      {isModalOpen && (
        <ModalCompra
          editingCompra={editingCompra}
          onClose={handleCloseModal}
          onSaved={handleCloseModal}
        />
      )}

      {/* Modal de Ingreso de Material */}
      {isIngresoModalOpen && (
        <ModalIngresoMaterial
          compra={editingCompra}
          onClose={handleCloseIngreso}
          onSaved={handleCloseIngreso}
        />
      )}
    </div>
  );
}
