// src/pages/Perfiles.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Perfiles() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [perfiles, setPerfiles] = useState([]);
  const [editing, setEditing] = useState(null);

  const [perfilForm, setPerfilForm] = useState({
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
      admin: false,
    },
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!token) return;
    fetchPerfiles();
  }, [token]);

  const fetchPerfiles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/perfiles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener perfiles");
      const data = await res.json();
      setPerfiles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (name.startsWith("permisos.")) {
      const subfield = name.split(".")[1];
      setPerfilForm((prev) => ({
        ...prev,
        permisos: { ...prev.permisos, [subfield]: type === "checkbox" ? checked : value },
      }));
    } else {
      setPerfilForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/perfiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(perfilForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear perfil");
      }
      await fetchPerfiles();
      setPerfilForm({
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
          admin: false,
        },
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (p) => {
    setEditing(p._id);
    setPerfilForm({
      nombre: p.nombre,
      password: p.password,
      permisos: { ...p.permisos },
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/perfiles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: editing, ...perfilForm }),
      });
      if (!res.ok) throw new Error("Error al editar perfil");
      await fetchPerfiles();
      setEditing(null);
      setPerfilForm({
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
          admin: false,
        },
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este perfil?")) return;
    try {
      const res = await fetch(`${API_URL}/api/perfiles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al eliminar perfil");
      await fetchPerfiles();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="page-contenedor">
      <h1>Gestión de Perfiles</h1>
      <p>(Solo el perfil con permisos.admin = true puede ver esto)</p>

      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Lista de perfiles */}
        <div style={{ flex: 1 }}>
          <h2>Perfiles Existentes</h2>
          {perfiles.map((p) => (
            <div
              key={p._id}
              style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "0.5rem" }}
            >
              <strong>{p.nombre}</strong> (pass: {p.password})
              {p.permisos.admin && (
                <span style={{ color: "red", marginLeft: "1rem" }}>[ADMIN]</span>
              )}
              <div>
                <button onClick={() => handleEditClick(p)}>Editar</button>
                <button onClick={() => handleDelete(p._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Form crear/editar */}
        <div style={{ flex: 1 }}>
          <h2>{editing ? "Editar Perfil" : "Crear Perfil"}</h2>
          <form onSubmit={editing ? handleUpdate : handleCreate}>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={perfilForm.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                type="text"
                name="password"
                value={perfilForm.password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="permisos.admin"
                  checked={perfilForm.permisos.admin}
                  onChange={handleInputChange}
                />
                Admin
              </label>
            </div>
            <label>
              <input
                type="checkbox"
                name="permisos.obras"
                checked={perfilForm.permisos.obras}
                onChange={handleInputChange}
              />
              Obras
            </label>
            {/* ... Repite para los demás permisos ... */}

            <button type="submit">{editing ? "Actualizar" : "Crear"}</button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setPerfilForm({
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
                      admin: false,
                    },
                  });
                }}
              >
                Cancelar
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
