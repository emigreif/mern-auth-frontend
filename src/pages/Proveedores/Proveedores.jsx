import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import styles from "./Proveedores.module.css";
import ModalBase from "../../components/ModalBase/ModalBase.jsx";

export default function Proveedores() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [proveedores, setProveedores] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNuevoProvOpen, setIsNuevoProvOpen] = useState(false);
  const [filtroRubro, setFiltroRubro] = useState("Todos");
  const [orden, setOrden] = useState("nombre"); // Opciones: "nombre", "saldo"

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
      if (!res.ok) throw new Error("Error al listar proveedores");
      const data = await res.json();
      setProveedores(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar un proveedor con confirmación
   */
  const handleDeleteProveedor = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    try {
      const res = await fetch(`${API_URL}/api/proveedores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar proveedor");

      setProveedores((prevProveedores) => prevProveedores.filter((prov) => prov._id !== id));
    } catch (error) {
      setErrorMsg("No se pudo eliminar el proveedor.");
    }
  };

  /**
   * Filtrar y ordenar proveedores
   */
  const proveedoresFiltrados = proveedores
    .filter((prov) => filtroRubro === "Todos" || (prov.rubro && prov.rubro.includes(filtroRubro)))
    .sort((a, b) => {
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (orden === "saldo") return b.saldo - a.saldo;
      return 0;
    });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Proveedores</h1>
        <button className={styles.addBtn} onClick={() => setIsNuevoProvOpen(true)}>
          ➕ Agregar Proveedor
        </button>
      </div>

      {/* Controles de Filtros y Ordenamiento */}
      <div className={styles.filters}>
        <select onChange={(e) => setFiltroRubro(e.target.value)} value={filtroRubro}>
          <option value="Todos">Todos los Rubros</option>
          <option value="Vidrio">Vidrio</option>
          <option value="Perfiles">Perfiles</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Compras Generales">Compras Generales</option>
        </select>

        <select onChange={(e) => setOrden(e.target.value)} value={orden}>
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
              <p><strong>Dirección:</strong> {prov.direccion}</p>
              <p><strong>Saldo:</strong> ${prov.saldo?.toFixed(2) || 0}</p>
              <p><strong>Rubros:</strong> {prov.rubro?.join(", ")}</p>
              <p><strong>Teléfono:</strong> {prov.telefono}</p>
              <p><strong>WhatsApp:</strong> {prov.whatsapp}</p>
              {prov.emails?.length > 0 && <p><strong>Emails:</strong> {prov.emails.join(", ")}</p>}

              <div className={styles.actions}>
                <Link to={`/proveedores/editar/${prov._id}`} className={styles.btnEdit}>
                  ✏️ Editar
                </Link>
                <button onClick={() => handleDeleteProveedor(prov._id)} className={styles.btnDelete}>
                  ❌ Eliminar
                </button>
              </div>
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
