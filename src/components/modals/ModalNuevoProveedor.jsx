// src/components/modals/modalNuevoProveedor.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

export default function ModalNuevoProveedor({ onCreated, onClose }) {
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

  // Manejo de emails (arreglo)
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
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      <form onSubmit={handleSubmit} className={styles.formBase}>
        <div className={styles.formGroup}>
          <label>Nombre <span>*</span></label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Dirección <span>*</span></label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Emails</label>
          {form.emails.map((email, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(i, e.target.value)}
              />
              <Button variant="danger" type="button" onClick={() => removeEmail(i)}>
                X
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addEmail}>+ Añadir Email</Button>
        </div>

        <div className={styles.formGroup}>
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
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
