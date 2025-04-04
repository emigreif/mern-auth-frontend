import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

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
        nombre: perfilData.nombre || "",
        password: perfilData.password || "",
        permisos: { ...perfilData.permisos },
      });
    }
  }, [perfilData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("permisos.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        permisos: {
          ...prev.permisos,
          [key]: type === "checkbox" ? checked : value,
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
      return setErrorMsg("El campo 'nombre' es obligatorio.");
    }

    try {
      const method = perfilData ? "PUT" : "POST";
      const url = `${API_URL}/api/perfiles`;
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
        const err = await res.json();
        throw new Error(err.message || "Error al guardar perfil");
      }

      onSave?.();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={perfilData ? "Editar Perfil" : "Nuevo Perfil"}
    >
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

        <label>
          Nombre
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>

        <fieldset style={{ border: "none", padding: 0 }}>
          <legend>Permisos</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {Object.entries(formData.permisos).map(([key, value]) => (
              <label key={key} style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name={`permisos.${key}`}
                  checked={value}
                  onChange={handleInputChange}
                />
                {key}
              </label>
            ))}
          </div>
        </fieldset>

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
