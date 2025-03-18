// src/components/NuevoProveedor/NuevoProveedor.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./NuevoProveedor.module.css";
import ModalBase from "../ModalBase/ModalBase.jsx";

/**
 * Modal para crear un nuevo Proveedor
 *  - Se validan campos requeridos (nombre, direccion).
 *  - onCreated => callback tras crear
 *  - onClose => cierra modal
 */
export default function NuevoProveedor({ onCreated, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    whatsapp: "",
    emails: [""],
    rubro: []
  });
  const [errorMsg, setErrorMsg] = useState("");

  const rubrosPosibles = [
    "Vidrio",
    "Perfiles",
    "Accesorios",
    "Compras Generales",
    "otro"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejo de emails si es array
  const handleEmailChange = (index, value) => {
    const newEmails = [...form.emails];
    newEmails[index] = value;
    setForm({ ...form, emails: newEmails });
  };

  const addEmail = () => {
    setForm({ ...form, emails: [...form.emails, ""] });
  };

  const removeEmail = (index) => {
    const newEmails = [...form.emails];
    newEmails.splice(index, 1);
    setForm({ ...form, emails: newEmails });
  };

  const handleRubroChange = (rubro) => {
    let newRubro = [...form.rubro];
    if (newRubro.includes(rubro)) {
      newRubro = newRubro.filter((r) => r !== rubro);
    } else {
      newRubro.push(rubro);
    }
    setForm({ ...form, rubro: newRubro });
  };

  const validate = () => {
    if (!form.nombre.trim()) return "El nombre del proveedor es obligatorio.";
    if (!form.direccion.trim()) return "La dirección es obligatoria.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear proveedor");
      }
      await res.json();
      if (onCreated) onCreated();
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title="Nuevo Proveedor">
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <form onSubmit={handleSubmit} className={styles.formBase}>
        <div>
          <label>Nombre (requerido)</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Dirección (requerida)</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Emails</label>
          {form.emails.map((email, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(i, e.target.value)}
              />
              <button type="button" onClick={() => removeEmail(i)}>X</button>
            </div>
          ))}
          <button type="button" onClick={addEmail}>+ Añadir Email</button>
        </div>

        <div>
          <label>Rubros</label>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {rubrosPosibles.map((r) => (
              <label key={r} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <input
                  type="checkbox"
                  checked={form.rubro.includes(r)}
                  onChange={() => handleRubroChange(r)}
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </ModalBase>
  );
}
