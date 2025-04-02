// src/pages/Obras.jsx
import React, { useState, useEffect } from "react";
import styles from "../styles/pages/GlobalStylePages.module.css";
import { useAuth } from "../context/AuthContext.jsx";
import ModalObra from "../components/modals/ModalObra.jsx";
import Button from "../components/ui/Button.jsx";
import Table from "../components/ui/Table.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";

export default function Obras() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [obras, setObras] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObra, setEditingObra] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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

  const ordenarPor = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredObras = obras.filter((obra) =>
    Object.values(obra).some((val) =>
      String(val ?? "").toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const sortedObras = [...filteredObras].sort((a, b) => {
    if (!sortConfig.key) return 0;
  
    const key = sortConfig.key;
    const aVal = a[key];
    const bVal = b[key];
  
    if (key === "fechaEntrega") {
      const aDate = aVal ? new Date(aVal) : new Date(0);
      const bDate = bVal ? new Date(bVal) : new Date(0);
      return sortConfig.direction === "asc"
        ? aDate - bDate
        : bDate - aDate;
    }
  
    const aStr = String(aVal ?? "").toLowerCase();
    const bStr = String(bVal ?? "").toLowerCase();
    return sortConfig.direction === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
  

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Obras</h1>
        <Button onClick={handleOpenCreate}>+ Agregar Obra</Button>
      </div>

      <div style={{ marginBottom: "10px", maxWidth: "300px" }}>
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar obras..."
        />
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando obras...</div>}
      {!loading && obras.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay obras para mostrar</div>
      )}

      {!loading && filteredObras.length > 0 && (
        <Table
          headers={[
            { key: "codigoObra", label: "Código Obra" },
            { key: "nombre", label: "Nombre" },
            { key: "direccion", label: "Dirección" },
            { key: "contacto", label: "Contacto" },
            { key: "fechaEntrega", label: "Fecha Entrega" },
            { key: "acciones", label: "Acciones" },
          ]}
          onSort={ordenarPor}
          sortConfig={sortConfig}
        >
          {sortedObras.map((o) => (
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
        </Table>
      )}

      {isModalOpen && (
        <ModalObra
          obra={editingObra}
          onClose={handleCloseModal}
          onSaved={handleCloseModal}
        />
      )}
    </div>
  );
}
