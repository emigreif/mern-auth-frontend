import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, Outlet } from "react-router-dom";
import ModalMovimientoContable from "../components/ModalMovimientoContable.jsx";
import styles from "../styles/pages/GlobalStylePages.css";
export default function Contabilidad() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [movimientos, setMovimientos] = useState([]);
  const [filtros, setFiltros] = useState({
    tipo: "",
    proveedor: "",
    cliente: "",
    obra: "",
    estadoCheque: "",
    desde: "",
    hasta: ""
  });

  const [obras, setObras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMovimiento, setEditMovimiento] = useState(null);

  useEffect(() => {
    if (token) {
      fetchDatos();
      fetchMovimientos();
    }
  }, [token]);

  const fetchDatos = async () => {
    try {
      const [resObras, resProvs, resClients] = await Promise.all([
        fetch(`${API_URL}/api/obras`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/proveedores`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/clientes`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setObras(await resObras.json());
      setProveedores(await resProvs.json());
      setClientes(await resClients.json());
    } catch (err) {
      console.error("Error al cargar datos auxiliares");
    }
  };

  const fetchMovimientos = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const params = new URLSearchParams(filtros);
      const res = await fetch(`${API_URL}/api/contabilidad?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Error al obtener movimientos");

      const data = await res.json();
      setMovimientos(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleOpenNuevo = () => {
    setEditMovimiento(null);
    setShowModal(true);
  };

  const handleOpenEditar = (mov) => {
    setEditMovimiento(mov);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar movimiento?")) return;

    try {
      const res = await fetch(`${API_URL}/api/contabilidad/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setMovimientos(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Contabilidad</h1>
        <nav>
          <Link to="nomina">Ir a Nómina</Link>
        </nav>

        {/* Filtros */}
        <div className={styles.filtros}>
          <select name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
            <option value="">-- Tipo --</option>
            {[
              "FACTURA_RECIBIDA", "FACTURA_EMITIDA",
              "PAGO_EMITIDO", "PAGO_RECIBIDO",
              "CHEQUE_EMITIDO", "CHEQUE_RECIBIDO",
              "EFECTIVO_EMITIDO", "EFECTIVO_RECIBIDO",
              "TRANSFERENCIA_EMITIDA", "TRANSFERENCIA_RECIBIDA"
            ].map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select name="proveedor" value={filtros.proveedor} onChange={handleFiltroChange}>
            <option value="">-- Proveedor --</option>
            {proveedores.map(p => <option key={p._id} value={p._id}>{p.nombre}</option>)}
          </select>

          <select name="cliente" value={filtros.cliente} onChange={handleFiltroChange}>
            <option value="">-- Cliente --</option>
            {clientes.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
          </select>

          <select name="obra" value={filtros.obra} onChange={handleFiltroChange}>
            <option value="">-- Obra --</option>
            {obras.map(o => <option key={o._id} value={o._id}>{o.nombre}</option>)}
          </select>

          <input type="date" name="desde" value={filtros.desde} onChange={handleFiltroChange} />
          <input type="date" name="hasta" value={filtros.hasta} onChange={handleFiltroChange} />

          <button onClick={fetchMovimientos}>Buscar</button>
        </div>

        <button onClick={handleOpenNuevo}>➕ Nuevo Movimiento</button>
      </div>

      {loading ? (
        <p>Cargando movimientos...</p>
      ) : errorMsg ? (
        <p style={{ color: "red" }}>{errorMsg}</p>
      ) : (
        <div className={styles.listaMovs}>
          {movimientos.length === 0 ? (
            <p>No hay movimientos.</p>
          ) : (
            movimientos.map((mov) => (
              <div key={mov._id} className={styles.movItem}>
                <h4>{mov.tipo} - ${mov.monto}</h4>
                <p>Fecha: {new Date(mov.fecha).toLocaleDateString()}</p>
                {mov.descripcion && <p>{mov.descripcion}</p>}
                <p>Obra: {mov.partidasObra?.map(po => po.obra?.nombre).join(", ")}</p>
                <p>Proveedor: {mov.idProveedor?.nombre || "-"} / Cliente: {mov.idCliente?.nombre || "-"}</p>
                <div className={styles.movActions}>
                  <button onClick={() => handleOpenEditar(mov)}>✏️</button>
                  <button onClick={() => handleEliminar(mov._id)}>❌</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <ModalMovimientoContable
          mode={editMovimiento ? "edit" : "create"}
          movimiento={editMovimiento}
          onClose={() => setShowModal(false)}
          onSuccess={fetchMovimientos}
        />
      )}

      <Outlet />
    </div>
  );
}
