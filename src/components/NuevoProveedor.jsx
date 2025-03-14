// frontend/src/components/NuevoProveedor.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Modal para crear un nuevo Proveedor
 */
export default function NuevoProveedor({ onCreated, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    emails: [""],        // si manejas array de emails
    telefono: "",
    whatsapp: "",
    rubro: [],           // array de strings
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de emails si deseas array
  const handleEmailChange = (index, newVal) => {
    const newEmails = [...form.emails];
    newEmails[index] = newVal;
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

  // Manejo de rubros => checkboxes o multi-select
  const rubrosPosibles = ["Vidrio", "Perfiles", "Accesorios", "Compras Generales"];

  const handleRubroChange = (rubro) => {
    let newRubro = [...form.rubro];
    if (newRubro.includes(rubro)) {
      // quitar
      newRubro = newRubro.filter((r) => r !== rubro);
    } else {
      // agregar
      newRubro.push(rubro);
    }
    setForm({ ...form, rubro: newRubro });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.nombre.trim()) {
      setErrorMsg("El nombre del proveedor es obligatorio");
      return;
    }
    if (!form.direccion.trim()) {
      setErrorMsg("La dirección es obligatoria");
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Nuevo Proveedor</h2>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Emails</label>
            {form.emails.map((email, index) => (
              <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                />
                <button type="button" onClick={() => removeEmail(index)}>X</button>
              </div>
            ))}
            <button type="button" onClick={addEmail}>+ Añadir Email</button>
          </div>

          <div className="form-group">
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

          <div className="form-actions" style={{ marginTop: "1rem" }}>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
