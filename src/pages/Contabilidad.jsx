import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Outlet } from "react-router-dom";
import ModalMovimientoContable from "../components/modals/ModalMovimientoContable.jsx";
import Button from "../components/ui/Button.jsx";
import Table from "../components/ui/Table.jsx";
import Filtro from "../components/ui/Filtro.jsx";
import Input from "../components/ui/Input.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";

export default function Contabilidad() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [movimientos, setMovimientos] = useState([]);
  const [showFiltroAvanzado, setShowFiltroAvanzado] = useState(false);
  const [search, setSearch] = useState("");
  const [filtros, setFiltros] = useState({
    tipo: "",
    proveedor: "",
    cliente: "",
    obra: "",
    desde: "",
    hasta: "",
  });

  const [obras, setObras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMovimiento, setEditMovimiento] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
    } catch {
      console.error("Error al cargar datos auxiliares");
    }
  };

  const fetchMovimientos = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const params = new URLSearchParams({ ...filtros, search });
      const res = await fetch(`${API_URL}/api/contabilidad?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFiltroReset = () => {
    setFiltros({
      tipo: "",
      proveedor: "",
      cliente: "",
      obra: "",
      desde: "",
      hasta: "",
    });
  };

  const ordenarPor = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar");
      setMovimientos((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const sortedMovs = [...movimientos].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = String(a[sortConfig.key] || "").toLowerCase();
    const valB = String(b[sortConfig.key] || "").toLowerCase();
    return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const filtrosData = [
    {
      name: "tipo",
      label: "Tipo",
      type: "select",
      value: filtros.tipo,
      options: [
        "FACTURA_EMITIDA", "FACTURA_RECIBIDA", "PAGO_EMITIDO", "PAGO_RECIBIDO",
        "CHEQUE_EMITIDO", "CHEQUE_RECIBIDO", "EFECTIVO_EMITIDO", "EFECTIVO_RECIBIDO",
        "TRANSFERENCIA_EMITIDA", "TRANSFERENCIA_RECIBIDA",
      ],
    },
    {
      name: "proveedor",
      label: "Proveedor",
      type: "select",
      value: filtros.proveedor,
      options: proveedores.map((p) => ({ value: p._id, label: p.nombre })),
    },
    {
      name: "cliente",
      label: "Cliente",
      type: "select",
      value: filtros.cliente,
      options: clientes.map((c) => ({ value: c._id, label: c.nombre })),
    },
    {
      name: "obra",
      label: "Obra",
      type: "select",
      value: filtros.obra,
      options: obras.map((o) => ({ value: o._id, label: o.nombre })),
    },
    {
      name: "desde",
      label: "Desde",
      type: "date",
      value: filtros.desde,
    },
    {
      name: "hasta",
      label: "Hasta",
      type: "date",
      value: filtros.hasta,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Contabilidad</h1>
        <Button onClick={handleOpenNuevo}>➕ Nuevo Movimiento</Button>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", marginBottom: "1rem" }}>
        <Input
          name="search"
          placeholder="Buscar por texto..."
          value={search}
          onChange={handleSearchChange}
        />
        <Button onClick={fetchMovimientos}>Buscar</Button>
        <Button variant="secondary" onClick={() => setShowFiltroAvanzado((prev) => !prev)}>
          {showFiltroAvanzado ? "Ocultar Filtros" : "Filtros Avanzados"}
        </Button>
      </div>

      {showFiltroAvanzado && (
        <Filtro filtros={filtrosData} onChange={handleFiltroChange} onReset={handleFiltroReset} />
      )}

      {loading ? (
        <p>Cargando movimientos...</p>
      ) : errorMsg ? (
        <p style={{ color: "red" }}>{errorMsg}</p>
      ) : sortedMovs.length === 0 ? (
        <p>No hay movimientos.</p>
      ) : (
        <Table
          headers={[
            { key: "tipo", label: "Tipo" },
            { key: "monto", label: "Monto" },
            { key: "fecha", label: "Fecha" },
            { key: "descripcion", label: "Descripción" },
            { key: "obras", label: "Obra/s" },
            { key: "proveedor", label: "Proveedor" },
            { key: "cliente", label: "Cliente" },
            { key: "acciones", label: "Acciones" },
          ]}
          onSort={ordenarPor}
          sortConfig={sortConfig}
        >
          {sortedMovs.map((mov) => (
            <tr key={mov._id}>
              <td>{mov.tipo}</td>
              <td>${mov.monto.toFixed(2)}</td>
              <td>{new Date(mov.fecha).toLocaleDateString()}</td>
              <td>{mov.descripcion}</td>
              <td>{mov.partidasObra?.map((po) => po.obra?.nombre).join(", ")}</td>
              <td>{mov.idProveedor?.nombre || "-"}</td>
              <td>{mov.idCliente?.nombre || "-"}</td>
              <td>
                <Button onClick={() => handleOpenEditar(mov)}>✏️</Button>
                <Button variant="danger" onClick={() => handleEliminar(mov._id)}>❌</Button>
              </td>
            </tr>
          ))}
        </Table>
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
