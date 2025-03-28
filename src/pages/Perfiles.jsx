// src/pages/Perfiles.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";
import Button from "../components/ui/Button.jsx";

const Perfiles = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [perfiles, setPerfiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    password: "",
    permisos: {
      dashboard: false,
      obras: false,
      clientes: false,
      presupuestos: false,
      proveedores: false,
      contabilidad: false,
      reportes: false,
      nomina: false,
      admin: false
    }
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchPerfiles();
    }
  }, [token]);

  const fetchPerfiles = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/perfiles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al listar perfiles");
      }
      const data = await res.json();
      setPerfiles(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("permisos.")) {
      const subfield = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        permisos: {
          ...prev.permisos,
          [subfield]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditClick = (perfil) => {
    setEditingId(perfil._id);
    setFormData({
      nombre: perfil.nombre,
      password: perfil.password,
      permisos: { ...perfil.permisos }
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      nombre: "",
      password: "",
      permisos: {
        dashboard: false,
        obras: false,
        clientes: false,
        presupuestos: false,
        proveedores: false,
        contabilidad: false,
        reportes: false,
        nomina: false,
        admin: false
      }
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este perfil?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_URL}/api/perfiles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al eliminar perfil");
      }
      setSuccessMsg("Perfil eliminado");
      fetchPerfiles();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!formData.nombre.trim()) {
      setErrorMsg("El campo 'nombre' es obligatorio.");
      return;
    }
    try {
      let url = `${API_URL}/api/perfiles`;
      let method = "POST";
      if (editingId) {
        url = `${API_URL}/api/perfiles`;
        method = "PUT";
      }
      const body = editingId ? { id: editingId, ...formData } : { ...formData };
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al guardar perfil");
      }
      await res.json();
      setSuccessMsg(editingId ? "Perfil actualizado" : "Perfil creado");
      handleCancelEdit();
      fetchPerfiles();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Gestión de Perfiles</h1>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando perfiles...</div>}

      {!loading && perfiles.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay perfiles para mostrar</div>
      )}

      <div className={styles.list}>
        {perfiles.map((p) => (
          <div key={p._id} className={styles.profileCard}>
            <strong>{p.nombre}</strong>
            {p.permisos?.admin && <span className={styles.adminBadge}>[ADMIN]</span>}
            <p>Password: {p.password}</p>
            <div className={styles.actions}>
              <Button onClick={() => handleEditClick(p)}>Editar</Button>
              <Button variant="danger" onClick={() => handleDelete(p._id)}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.formSection}>
        <h2>{editingId ? "Editar Perfil" : "Crear Perfil"}</h2>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Contraseña (del perfil)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h3>Permisos</h3>
            <div className={styles.permissionsContainer}>
              {Object.keys(formData.permisos).map((perm) => (
                <div key={perm} className={styles.permissionItem}>
                  <input
                    type="checkbox"
                    name={`permisos.${perm}`}
                    checked={formData.permisos[perm]}
                    onChange={handleInputChange}
                  />
                  <label>{perm}</label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.actions}>
            <Button type="submit">{editingId ? "Actualizar" : "Guardar"}</Button>
            {editingId && (
              <Button variant="secondary" type="button" onClick={handleCancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Perfiles;
