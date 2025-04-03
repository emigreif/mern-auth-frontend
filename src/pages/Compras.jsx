import React, { useEffect, useState } from "react";
import styles from "../styles/pages/GlobalStylePages.module.css";
import { useAuth } from "../context/AuthContext.jsx";
import ModalCompra from "../components/modals/ModalCompra.jsx";
import ModalIngresoMaterial from "../components/modals/ModalIngresoMaterial.jsx";
import Button from "../components/ui/Button.jsx";
import Semaforo from "../components/ui/Semaforo.jsx";
import Table from "../components/ui/Table.jsx";

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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    if (token) {
      fetchCompras();
    }
  }, [token, tipo]);

  const fetchCompras = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const url = `${API_URL}/api/compras/${tipo}`;
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

  const renderSemaforo = (compra) => {
    if (compra.estado === "anulado") return <Semaforo estado="rojo" texto="Anulado" />;
    if (compra.estado === "completado") return <Semaforo estado="verde" texto="Completado" />;

    if (!compra.fechaEstimadaEntrega) return <Semaforo estado="amarillo" texto="Pendiente" />;

    const diasRestantes = (new Date(compra.fechaEstimadaEntrega) - new Date()) / (1000 * 60 * 60 * 24);
    if (diasRestantes < 0) return <Semaforo estado="rojo" texto="Vencido" />;
    if (diasRestantes < 3) return <Semaforo estado="naranja" texto="Próximo" />;

    return <Semaforo estado="amarillo" texto="Pendiente" />;
  };

  const ordenarPor = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCompras = [...compras].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = obtenerValor(a, sortConfig.key);
    const bVal = obtenerValor(b, sortConfig.key);
    return sortConfig.direction === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const obtenerValor = (item, key) => {
    switch (key) {
      case "numeroOC": return String(item.numeroOC || "");
      case "codigoObra": return String(item.obra?.codigoObra || "");
      case "nombreObra": return String(item.obra?.nombre || "");
      case "tipo": return String(item.tipo || "");
      case "proveedor": return String(item.proveedor?.nombre || "");
      case "estado": return String(item.estado || "");
      default: return "";
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Portal de Compras</h1>
        <Button onClick={handleOpenCreate} className={styles.newCompraBtn}>
          + Nueva Compra
        </Button>
      </div>

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
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando compras...</div>}
      {!loading && sortedCompras.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay compras para mostrar</div>
      )}

      {!loading && sortedCompras.length > 0 && (
        <Table
          headers={[
            { key: "numeroOC", label: "OC #" },
            { key: "codigoObra", label: "Cód. Obra" },
            { key: "nombreObra", label: "Obra" },
            { key: "tipo", label: "Tipo" },
            { key: "proveedor", label: "Proveedor" },
            { key: "estado", label: "Estado" },
            { key: "semaforo", label: "Semáforo" },
            { key: "acciones", label: "Acciones" },
          ]}
          onSort={ordenarPor}
          sortConfig={sortConfig}
        >
          {sortedCompras.map((c) => (
            <tr key={c._id}>
              <td>{c.numeroOC}</td>
              <td>{c.obra?.codigoObra}</td>
              <td>{c.obra?.nombre}</td>
              <td>{c.tipo}</td>
              <td>{c.proveedor?.nombre}</td>
              <td>{c.estado}</td>
              <td>{renderSemaforo(c)}</td>
              <td style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {c.estado !== "anulado" && c.estado !== "completado" && (
                  <>
                    <Button onClick={() => handleOpenEdit(c)}>✏️ Editar</Button>
                    <Button onClick={() => handleOpenIngreso(c)}>Ingreso</Button>
                    <Button variant="danger" onClick={() => handleAnular(c._id)}>Anular</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}

      {isModalOpen && (
        <ModalCompra
          editingCompra={editingCompra}
          onClose={handleCloseModal}
          onSaved={handleCloseModal}
        />
      )}

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
