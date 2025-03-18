// src/pages/Proveedores.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Proveedores.module.css";

// Modal para crear nuevo proveedor
import ModalBase from "../../components/ModalBase/ModalBase.jsx";

export default function Proveedores() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [proveedores, setProveedores] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal crear proveedor
  const [isNuevoProvOpen, setIsNuevoProvOpen] = useState(false);

  // Form proveedor
  const [formProv, setFormProv] = useState({
    nombre: "",
    direccion: "",
    emails: [""], // array de strings
    telefono: "",
    whatsapp: "",
    rubro: [],    // array de strings
  });

  const rubrosPosibles = ["Vidrio", "Perfiles", "Accesorios", "Compras Generales"];

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
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al listar proveedores");
      }
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = () => {
    setFormProv((prev) => ({
      ...prev,
      emails: [...prev.emails, ""]
    }));
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

  const handleProvInputChange = (e) => {
    const { name, value } = e.target;
    setFormProv((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProveedor = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validaciones mínimas
    if (!formProv.nombre.trim()) {
      setErrorMsg("El campo 'Nombre' es obligatorio");
      return;
    }
    if (!formProv.direccion.trim()) {
      setErrorMsg("El campo 'Dirección' es obligatorio");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formProv)
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al crear proveedor");
      }
      await res.json();
      setIsNuevoProvOpen(false);
      fetchProveedores();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Proveedores</h1>
        <button className={styles.addBtn} onClick={() => setIsNuevoProvOpen(true)}>
          + Agregar Proveedor
        </button>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando proveedores...</div>}

      {!loading && proveedores.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay proveedores para mostrar</div>
      )}

      {!loading && proveedores.length > 0 && (
        <div className={styles.proveedoresList}>
          {proveedores.map((prov) => (
            <div key={prov._id} className={styles.proveedorCard}>
              <h2>{prov.nombre}</h2>
              <p><strong>Dirección:</strong> {prov.direccion}</p>
              <p><strong>Saldo:</strong> ${prov.saldo?.toFixed(2) || 0}</p>
              <p><strong>Rubros:</strong> {prov.rubro?.join(", ")}</p>
              <p><strong>Teléfono:</strong> {prov.telefono}</p>
              <p><strong>WhatsApp:</strong> {prov.whatsapp}</p>
              {prov.emails && prov.emails.length > 0 && (
                <p><strong>Emails:</strong> {prov.emails.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal para nuevo proveedor */}
      {isNuevoProvOpen && (
        <ModalBase
          isOpen={isNuevoProvOpen}
          onClose={() => setIsNuevoProvOpen(false)}
          title="Nuevo Proveedor"
        >
          <form onSubmit={handleCreateProveedor}>
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

            <div style={{ marginTop: "1rem" }}>
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setIsNuevoProvOpen(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </ModalBase>
      )}
    </div>
  );
}
