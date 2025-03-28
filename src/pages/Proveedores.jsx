// src/pages/Proveedores.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "../components/modals/modalBase.jsx";
import ModalMovimientoContable from "../components/modals/modalMovimientoContable.jsx";
import Button from "../components/Button.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";

export default function Proveedores() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [proveedores, setProveedores] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProvId, setCurrentProvId] = useState(null);
  const [showModalMovimiento, setShowModalMovimiento] = useState(false);
  const [proveedorForMovimiento, setProveedorForMovimiento] = useState(null);

  const initialFormProv = {
    nombre: "",
    direccion: "",
    emails: [""],
    telefono: "",
    whatsapp: "",
    rubro: [],
  };
  const [formProv, setFormProv] = useState(initialFormProv);
  const rubrosPosibles = [
    "Vidrio",
    "Perfiles",
    "Accesorios",
    "Compras Generales",
  ];

  useEffect(() => {
    if (token) fetchProveedores();
  }, [token]);

  const fetchProveedores = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProveedores(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModalForCreate = () => {
    setFormProv(initialFormProv);
    setEditMode(false);
    setCurrentProvId(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (prov) => {
    setFormProv({
      nombre: prov.nombre || "",
      direccion: prov.direccion || "",
      emails: prov.emails?.length ? prov.emails : [""],
      telefono: prov.telefono || "",
      whatsapp: prov.whatsapp || "",
      rubro: prov.rubro || [],
    });
    setEditMode(true);
    setCurrentProvId(prov._id);
    setIsModalOpen(true);
  };

  const handleOpenMovimientoProveedor = (prov) => {
    setProveedorForMovimiento(prov);
    setShowModalMovimiento(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormProv(initialFormProv);
    setEditMode(false);
    setCurrentProvId(null);
    setErrorMsg("");
  };

  const handleCreateProveedor = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!formProv.nombre.trim() || !formProv.direccion.trim()) {
      setErrorMsg("Nombre y dirección son obligatorios");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formProv),
      });
      const data = await res.json();
      setProveedores((prev) => [...prev, data]);
      handleCloseModal();
    } catch (err) {
      setErrorMsg("Error al crear proveedor");
    }
  };

  const handleUpdateProveedor = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!formProv.nombre.trim() || !formProv.direccion.trim()) {
      setErrorMsg("Nombre y dirección son obligatorios");
      return;
    }
    const updatedProv = {
      ...formProv,
      emails: formProv.emails.filter((e) => e.trim() !== ""),
    };
    try {
      const res = await fetch(`${API_URL}/api/proveedores/${currentProvId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProv),
      });
      const data = await res.json();
      setProveedores((prev) =>
        prev.map((p) => (p._id === currentProvId ? data : p))
      );
      handleCloseModal();
    } catch (err) {
      setErrorMsg("Error al actualizar proveedor");
    }
  };

  const handleDeleteProveedor = async (id) => {
    if (!window.confirm("¿Eliminar proveedor?")) return;
    try {
      await fetch(`${API_URL}/api/proveedores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProveedores((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setErrorMsg("Error al eliminar proveedor");
    }
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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Proveedores</h1>
        <Button onClick={handleOpenModalForCreate}>➕ Agregar Proveedor</Button>
      </div>
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <p>Cargando proveedores...</p>}
      <div className={styles.proveedoresGrid}>
        {proveedores.map((prov) => (
          <div key={prov._id}>
            <div className={styles.header}>
              <h1>{prov.nombre}</h1>
              <h2>Saldo: ${prov.saldo?.toFixed(2) || 0}</h2>
            </div>
            <h3>
              {prov.rubro?.length > 0 && <p>Rubros: {prov.rubro.join(", ")}</p>}
            </h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "50px" }}>
              <p>Dirección: {prov.direccion}</p>
              <p>Tel: {prov.telefono}</p>
              <p>WhatsApp: {prov.whatsapp}</p>

              {prov.emails?.length > 0 && (
                <p>Emails: {prov.emails.join(", ")}</p>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={() => handleOpenModalForEdit(prov)}>
                ✏️ Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteProveedor(prov._id)}
              >
                ❌ Eliminar
              </Button>
            </div>
            <div style={{ borderTop: "1px solid #ccc", margin: "20px" }}></div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <ModalBase
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editMode ? "Editar Proveedor" : "Nuevo Proveedor"}
        >
          <form
            onSubmit={editMode ? handleUpdateProveedor : handleCreateProveedor}
          >
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formProv.nombre}
              onChange={(e) =>
                setFormProv({ ...formProv, nombre: e.target.value })
              }
              required
            />
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formProv.direccion}
              onChange={(e) =>
                setFormProv({ ...formProv, direccion: e.target.value })
              }
              required
            />
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formProv.telefono}
              onChange={(e) =>
                setFormProv({ ...formProv, telefono: e.target.value })
              }
            />
            <label>WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={formProv.whatsapp}
              onChange={(e) =>
                setFormProv({ ...formProv, whatsapp: e.target.value })
              }
            />
            <label>Emails</label>
            {formProv.emails.map((email, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(i, e.target.value)}
                />
                <Button
                  variant="danger"
                  type="button"
                  onClick={() => handleRemoveEmail(i)}
                >
                  X
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddEmail}>
              + Añadir Email
            </Button>
            <label>Rubros</label>
            {rubrosPosibles.map((r) => (
              <label
                key={r}
                style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <input
                  type="checkbox"
                  checked={formProv.rubro.includes(r)}
                  onChange={() => handleRubroChange(r)}
                />
                {r}
              </label>
            ))}
            <div>
              <Button type="submit">Guardar</Button>
              <Button
                variant="secondary"
                type="button"
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </ModalBase>
      )}
      {showModalMovimiento && proveedorForMovimiento && (
        <ModalMovimientoContable
          mode="create"
          proveedorId={proveedorForMovimiento._id}
          onClose={() => {
            setProveedorForMovimiento(null);
            setShowModalMovimiento(false);
          }}
          onSuccess={fetchProveedores}
        />
      )}
    </div>
  );
}
