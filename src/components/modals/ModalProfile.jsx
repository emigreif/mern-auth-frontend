// src/components/modals/ModalPerfil.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase";
import Button from "../ui/Button";

export default function ModalPerfil({
  isOpen,
  onClose,
  perfilData = null,
  onSave,
  token,
  API_URL,
}) {
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
      admin: false,
    },
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (perfilData) {
      setFormData({
        nombre: perfilData.nombre,
        password: perfilData.password,
        permisos: { ...perfilData.permisos },
      });
    } else {
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
          admin: false,
        },
      });
    }
  }, [perfilData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("permisos.")) {
      const subfield = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        permisos: {
          ...prev.permisos,
          [subfield]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!formData.nombre.trim()) {
      setErrorMsg("El campo 'nombre' es obligatorio.");
      return;
    }
    try {
      const url = `${API_URL}/api/perfiles`;
      const method = perfilData ? "PUT" : "POST";
      const body = perfilData ? { id: perfilData._id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al guardar perfil");
      }

      onSave(); // cerrar modal y refrescar lista
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={perfilData ? "Editar Perfil" : "Nuevo Perfil"}
    >
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {errorMsg && (
          <p style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</p>
        )}

        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <h4>Permisos</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
            {Object.keys(formData.permisos).map((perm) => (
              <label key={perm} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <input
                  type="checkbox"
                  name={`permisos.${perm}`}
                  checked={formData.permisos[perm]}
                  onChange={handleInputChange}
                />
                {perm}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Button type="submit">{perfilData ? "Actualizar" : "Guardar"}</Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
