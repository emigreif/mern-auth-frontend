// src/pages/Proveedores.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalNuevoProveedor from "../components/modals/ModalNuevoProveedor.jsx";
import ModalMovimientoContable from "../components/modals/ModalMovimientoContable.jsx";
import ModalVerMovimientosProveedor from "../components/modals/ModalVerMovimientosProveedor.jsx";
import Button from "../components/ui/Button.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";
import Table from "../components/ui/Table.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";

export default function Proveedores() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProv, setSelectedProv] = useState(null);
  const [selectedProvId, setSelectedProvId] = useState(null);

  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [showVerMovimientosModal, setShowVerMovimientosModal] = useState(false);
  const [provMovimiento, setProvMovimiento] = useState(null);

  useEffect(() => {
    if (token) fetchProveedores();
  }, [token]);

  const fetchProveedores = async () => {
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProveedores(Array.isArray(data) ? data : []);
    } catch {
      alert("Error al cargar proveedores");
    }
  };

  const filteredProveedores = proveedores.filter((p) =>
    Object.values(p).some((val) =>
      String(Array.isArray(val) ? val.join(", ") : val || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  const sortedProveedores = [...filteredProveedores].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key] ?? "";
    const bVal = b[sortConfig.key] ?? "";
    return sortConfig.direction === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const ordenarPor = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const openCreate = () => {
    setEditMode(false);
    setSelectedProv(null);
    setSelectedProvId(null);
    setIsModalOpen(true);
  };

  const openEdit = (prov) => {
    setEditMode(true);
    setSelectedProv(prov);
    setSelectedProvId(prov._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar proveedor?")) return;
    try {
      await fetch(`${API_URL}/api/proveedores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProveedores();
    } catch {
      alert("Error al eliminar");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Proveedores</h1>
        <Button onClick={openCreate}>+ Agregar Proveedor</Button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar proveedor..."
      />

      <Table
        headers={[
          "Nombre",
          "Dirección",
          "Teléfono",
          "WhatsApp",
          "Emails",
          "Rubros",
          "Saldo",
          "Acciones",
        ]}
        onSort={(key) => ordenarPor(key.toLowerCase())}
        sortConfig={sortConfig}
      >
        {sortedProveedores.map((p) => (
          <tr key={p._id}>
            <td>{p.nombre}</td>
            <td>{p.direccion}</td>
            <td>{p.telefono}</td>
            <td>{p.whatsapp}</td>
            <td>{p.emails?.join(", ")}</td>
            <td>{p.rubro?.join(", ")}</td>
            <td>${p.saldo?.toFixed(2) || 0}</td>
            <td>
              <Button onClick={() => openEdit(p)}>Editar</Button>
              <Button variant="danger" onClick={() => handleDelete(p._id)}>
                Eliminar
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setProvMovimiento(p);
                  setShowVerMovimientosModal(true);
                }}
              >
                Ver movimientos
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setProvMovimiento(p);
                  setShowMovimientoModal(true);
                }}
              >
                + Movimiento
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      {isModalOpen && (
        <ModalNuevoProveedor
          onClose={() => setIsModalOpen(false)}
          onSaved={fetchProveedores}
          editMode={editMode}
          proveedor={selectedProv}
          proveedorId={selectedProvId}
          token={token}
          apiUrl={API_URL}
        />
      )}

      {showMovimientoModal && provMovimiento && (
        <ModalMovimientoContable
          mode="create"
          proveedorId={provMovimiento._id}
          onClose={() => {
            setShowMovimientoModal(false);
            fetchProveedores();
          }}
          onSuccess={fetchProveedores}
        />
      )}

      {showVerMovimientosModal && provMovimiento && (
        <ModalVerMovimientosProveedor
          proveedorId={provMovimiento._id}
          onClose={() => setShowVerMovimientosModal(false)}
        />
      )}
    </div>
  );
}
