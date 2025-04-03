import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "../components/modals/ModalBase.jsx";
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
  const [currentProvId, setCurrentProvId] = useState(null);
  const [formProv, setFormProv] = useState(initialForm());
  const [errorMsg, setErrorMsg] = useState("");

  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [showVerMovimientosModal, setShowVerMovimientosModal] = useState(false);
  const [provMovimiento, setProvMovimiento] = useState(null);

  const rubrosPosibles = ["Vidrio", "Perfiles", "Accesorios", "Compras Generales"];

  function initialForm() {
    return {
      nombre: "",
      direccion: "",
      emails: [""],
      telefono: "",
      whatsapp: "",
      rubro: [],
    };
  }

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
    } catch (err) {
      setErrorMsg("Error al cargar proveedores");
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

  const handleAddEmail = () => {
    setFormProv((prev) => ({ ...prev, emails: [...prev.emails, ""] }));
  };

  const handleRemoveEmail = (index) => {
    setFormProv((prev) => {
      const emails = [...prev.emails];
      emails.splice(index, 1);
      return { ...prev, emails };
    });
  };

  const handleEmailChange = (index, value) => {
    setFormProv((prev) => {
      const emails = [...prev.emails];
      emails[index] = value;
      return { ...prev, emails };
    });
  };

  const handleRubroChange = (rubro) => {
    setFormProv((prev) => {
      const rubros = prev.rubro.includes(rubro)
        ? prev.rubro.filter((r) => r !== rubro)
        : [...prev.rubro, rubro];
      return { ...prev, rubro: rubros };
    });
  };

  const openCreate = () => {
    setEditMode(false);
    setFormProv(initialForm());
    setIsModalOpen(true);
  };

  const openEdit = (prov) => {
    setEditMode(true);
    setCurrentProvId(prov._id);
    setFormProv({
      nombre: prov.nombre || "",
      direccion: prov.direccion || "",
      emails: prov.emails?.length ? prov.emails : [""],
      telefono: prov.telefono || "",
      whatsapp: prov.whatsapp || "",
      rubro: prov.rubro || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formProv.nombre.trim() || !formProv.direccion.trim()) {
      setErrorMsg("Nombre y dirección obligatorios");
      return;
    }

    const url = editMode
      ? `${API_URL}/api/proveedores/${currentProvId}`
      : `${API_URL}/api/proveedores`;
    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formProv,
          emails: formProv.emails.filter((e) => e.trim() !== ""),
        }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      await fetchProveedores();
      setIsModalOpen(false);
      setFormProv(initialForm());
    } catch (err) {
      setErrorMsg(err.message);
    }
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
      setErrorMsg("Error al eliminar");
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
        <ModalBase
          isOpen={true}
          title={editMode ? "Editar Proveedor" : "Nuevo Proveedor"}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={formProv.nombre}
              onChange={(e) =>
                setFormProv((prev) => ({ ...prev, nombre: e.target.value }))
              }
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              value={formProv.direccion}
              onChange={(e) =>
                setFormProv((prev) => ({ ...prev, direccion: e.target.value }))
              }
              required
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={formProv.telefono}
              onChange={(e) =>
                setFormProv((prev) => ({ ...prev, telefono: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="WhatsApp"
              value={formProv.whatsapp}
              onChange={(e) =>
                setFormProv((prev) => ({ ...prev, whatsapp: e.target.value }))
              }
            />

            {formProv.emails.map((email, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  value={email}
                  placeholder={`Email ${i + 1}`}
                  onChange={(e) => handleEmailChange(i, e.target.value)}
                />
                <Button variant="danger" onClick={() => handleRemoveEmail(i)}>
                  X
                </Button>
              </div>
            ))}
            <Button onClick={handleAddEmail} type="button">
              + Email
            </Button>

            <div style={{ margin: "10px 0" }}>
              <strong>Rubros:</strong>
              {rubrosPosibles.map((r) => (
                <label key={r} style={{ marginLeft: 10 }}>
                  <input
                    type="checkbox"
                    checked={formProv.rubro.includes(r)}
                    onChange={() => handleRubroChange(r)}
                  />
                  {r}
                </label>
              ))}
            </div>

            <div style={{ marginTop: 10 }}>
              <Button type="submit">Guardar</Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
            </div>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          </form>
        </ModalBase>
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
