// src/pages/Proveedores.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import ModalBase from "../../components/ModalBase/ModalBase.jsx";
import styles from "./Proveedores.module.css";

export default function Proveedores() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Lista de proveedores
  const [proveedores, setProveedores] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado para modal y formulario (crear / editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProvId, setCurrentProvId] = useState(null);

  const initialFormProv = {
    nombre: "",
    direccion: "",
    emails: [""],
    telefono: "",
    whatsapp: "",
    rubro: [],
  };

  const [formProv, setFormProv] = useState(initialFormProv);

  // Filtro por rubro y ordenamiento (opcional, si lo deseas)
  const [filtroRubro, setFiltroRubro] = useState("Todos");
  const [orden, setOrden] = useState("nombre"); // "nombre" o "saldo"

  // Rubros posibles
  const rubrosPosibles = ["Vidrio", "Perfiles", "Accesorios", "Compras Generales"];

  // Cargar proveedores al montar
  useEffect(() => {
    if (token) {
      fetchProveedores();
    }
  }, [token]);

  const fetchProveedores = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al listar proveedores");
      }
      const data = await res.json();
      setProveedores(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para emails
  const handleAddEmail = () => {
    setFormProv((prev) => ({ ...prev, emails: [...prev.emails, ""] }));
  };

  const handleRemoveEmail = (index) => {
    setFormProv((prev) => {
      const newEmails = [...prev.emails];
      newEmails.splice(index, 1);
      return { ...prev, emails: newEmails };
    });
  };

  const handleEmailChange = (index, value) => {
    setFormProv((prev) => {
      const newEmails = [...prev.emails];
      newEmails[index] = value;
      return { ...prev, emails: newEmails };
    });
  };

  // Función para rubros
  const handleRubroChange = (rubro) => {
    setFormProv((prev) => {
      const hasRubro = prev.rubro.includes(rubro);
      let newRubro = [...prev.rubro];
      if (hasRubro) {
        newRubro = newRubro.filter((r) => r !== rubro);
      } else {
        newRubro.push(rubro);
      }
      return { ...prev, rubro: newRubro };
    });
  };

  // Para inputs comunes
  const handleProvInputChange = (e) => {
    const { name, value } = e.target;
    setFormProv((prev) => ({ ...prev, [name]: value }));
  };

  // Abrir modal en modo "crear"
  const handleOpenModalForCreate = () => {
    setFormProv(initialFormProv);
    setEditMode(false);
    setCurrentProvId(null);
    setIsModalOpen(true);
    setErrorMsg("");
  };

  // Abrir modal en modo "editar"
  const handleOpenModalForEdit = (prov) => {
    setFormProv({
      nombre: prov.nombre || "",
      direccion: prov.direccion || "",
      emails: prov.emails && prov.emails.length ? prov.emails : [""],
      telefono: prov.telefono || "",
      whatsapp: prov.whatsapp || "",
      rubro: prov.rubro || [],
    });
    setEditMode(true);
    setCurrentProvId(prov._id);
    setIsModalOpen(true);
    setErrorMsg("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormProv(initialFormProv);
    setEditMode(false);
    setCurrentProvId(null);
    setErrorMsg("");
  };

  // Crear nuevo proveedor
  const handleCreateProveedor = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formProv.nombre.trim()) {
      setErrorMsg("El campo 'Nombre' es obligatorio");
      return;
    }
    if (!formProv.direccion.trim()) {
      setErrorMsg("El campo 'Dirección' es obligatorio");
      return;
    }

    const newProveedor = {
      nombre: formProv.nombre,
      direccion: formProv.direccion,
      telefono: formProv.telefono || "",
      whatsapp: formProv.whatsapp || "",
      emails: formProv.emails.filter((email) => email.trim() !== ""),
      rubro: Array.isArray(formProv.rubro) ? formProv.rubro : [],
    };

    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProveedor),
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al crear proveedor");
      }
      const data = await res.json();
      setProveedores((prev) => [...prev, data]);
      handleCloseModal();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Actualizar proveedor existente
  const handleUpdateProveedor = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formProv.nombre.trim()) {
      setErrorMsg("El campo 'Nombre' es obligatorio");
      return;
    }
    if (!formProv.direccion.trim()) {
      setErrorMsg("El campo 'Dirección' es obligatorio");
      return;
    }

    const updatedProveedor = {
      nombre: formProv.nombre,
      direccion: formProv.direccion,
      telefono: formProv.telefono || "",
      whatsapp: formProv.whatsapp || "",
      emails: formProv.emails.filter((email) => email.trim() !== ""),
      rubro: Array.isArray(formProv.rubro) ? formProv.rubro : [],
    };

    try {
      const res = await fetch(`${API_URL}/api/proveedores/${currentProvId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProveedor),
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al actualizar proveedor");
      }
      const data = await res.json();
      setProveedores((prev) =>
        prev.map((prov) => (prov._id === currentProvId ? data : prov))
      );
      handleCloseModal();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Eliminar proveedor
  const handleDeleteProveedor = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    try {
      const res = await fetch(`${API_URL}/api/proveedores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar proveedor");
      setProveedores((prev) => prev.filter((prov) => prov._id !== id));
    } catch (error) {
      setErrorMsg("No se pudo eliminar el proveedor.");
    }
  };

  // Filtrado y ordenamiento (opcional)
  const proveedoresFiltrados = proveedores
    .filter((prov) =>
      filtroRubro === "Todos" || (prov.rubro && prov.rubro.includes(filtroRubro))
    )
    .sort((a, b) => {
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (orden === "saldo") return (b.saldo || 0) - (a.saldo || 0);
      return 0;
    });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Proveedores</h1>
        <button className={styles.addBtn} onClick={handleOpenModalForCreate}>
          ➕ Agregar Proveedor
        </button>
      </div>

      {/* Controles de filtro y ordenamiento */}
      <div className={styles.filters}>
        <select value={filtroRubro} onChange={(e) => setFiltroRubro(e.target.value)}>
          <option value="Todos">Todos los Rubros</option>
          {rubrosPosibles.map((rubro) => (
            <option key={rubro} value={rubro}>
              {rubro}
            </option>
          ))}
        </select>

        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="nombre">Ordenar por Nombre</option>
          <option value="saldo">Ordenar por Saldo</option>
        </select>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando proveedores...</div>}

      {!loading && proveedoresFiltrados.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay proveedores para mostrar</div>
      )}

      {!loading && proveedoresFiltrados.length > 0 && (
        <div className={styles.proveedoresGrid}>
          {proveedoresFiltrados.map((prov) => (
            <div key={prov._id} className={styles.proveedorCard}>
              <h2>{prov.nombre}</h2>
              <p>
                <strong>Dirección:</strong> {prov.direccion}
              </p>
              <p>
                <strong>Saldo:</strong> ${prov.saldo?.toFixed(2) || 0}
              </p>
              <p>
                <strong>Rubros:</strong> {prov.rubro?.join(", ")}
              </p>
              <p>
                <strong>Teléfono:</strong> {prov.telefono}
              </p>
              <p>
                <strong>WhatsApp:</strong> {prov.whatsapp}
              </p>
              {prov.emails && prov.emails.length > 0 && (
                <p>
                  <strong>Emails:</strong> {prov.emails.join(", ")}
                </p>
              )}

              <div className={styles.actions}>
                <button
                  onClick={() => handleOpenModalForEdit(prov)}
                  className={styles.btnEdit}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDeleteProveedor(prov._id)}
                  className={styles.btnDelete}
                >
                  ❌ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear/editar proveedor */}
      {isModalOpen && (
        <ModalBase
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editMode ? "Editar Proveedor" : "Nuevo Proveedor"}
        >
          <form onSubmit={editMode ? handleUpdateProveedor : handleCreateProveedor}>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formProv.nombre}
                onChange={handleProvInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formProv.direccion}
                onChange={handleProvInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formProv.telefono}
                onChange={handleProvInputChange}
              />
            </div>

            <div className="form-group">
              <label>WhatsApp</label>
              <input
                type="text"
                name="whatsapp"
                value={formProv.whatsapp}
                onChange={handleProvInputChange}
              />
            </div>

            <div className="form-group">
              <label>Emails</label>
              {formProv.emails.map((email, idx) => (
                <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(idx, e.target.value)}
                  />
                  <button type="button" onClick={() => handleRemoveEmail(idx)}>
                    X
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddEmail}>
                + Añadir Email
              </button>
            </div>

            <div className="form-group">
              <label>Rubros</label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {rubrosPosibles.map((r) => (
                  <label key={r} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <input
                      type="checkbox"
                      checked={formProv.rubro.includes(r)}
                      onChange={() => handleRubroChange(r)}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button type="submit">{editMode ? "Actualizar" : "Guardar"}</button>
              <button type="button" onClick={handleCloseModal}>
                Cancelar
              </button>
            </div>
          </form>
        </ModalBase>
      )}
    </div>
  );
}
