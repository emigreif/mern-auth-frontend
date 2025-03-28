// src/components/modals/modalNuevoCliente.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

export default function ModalNuevoCliente({ onCreated, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: {
      calle: "",
      ciudad: ""
    },
    condicionFiscal: "consumidorFinal",
    razonSocial: "",
    cuit: ""
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("direccion.")) {
      const subfield = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        direccion: { ...prev.direccion, [subfield]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validaciones básicas
    if (!form.nombre.trim() || !form.apellido.trim() || !form.email.trim()) {
      setErrorMsg("Los campos nombre, apellido y email son requeridos.");
      return;
    }
    if (form.condicionFiscal === "responsableInscripto") {
      if (!form.razonSocial.trim()) {
        setErrorMsg("La razón social es requerida para Responsable Inscripto.");
        return;
      }
      if (!form.cuit.trim()) {
        setErrorMsg("El CUIT es requerido para Responsable Inscripto.");
        return;
      }
    }

    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear cliente");
      }
      await res.json();
      if (onCreated) onCreated();
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title="Agregar Nuevo Cliente">
      <form onSubmit={handleSubmit} className={styles.formBase}>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        
        <div className={styles.formGroup}>
          <label>Nombre <span>*</span></label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Apellido <span>*</span></label>
          <input type="text" name="apellido" value={form.apellido} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Email <span>*</span></label>
          <input type="email" name="email" value={form.email} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Dirección - Calle</label>
          <input type="text" name="direccion.calle" value={form.direccion.calle} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Dirección - Ciudad</label>
          <input type="text" name="direccion.ciudad" value={form.direccion.ciudad} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Condición Fiscal</label>
          <select name="condicionFiscal" value={form.condicionFiscal} onChange={handleInputChange}>
            <option value="consumidorFinal">Consumidor Final</option>
            <option value="responsableInscripto">Responsable Inscripto</option>
          </select>
        </div>
        {form.condicionFiscal === "responsableInscripto" && (
          <>
            <div className={styles.formGroup}>
              <label>Razón Social <span>*</span></label>
              <input type="text" name="razonSocial" value={form.razonSocial} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label>CUIT <span>*</span></label>
              <input type="text" name="cuit" value={form.cuit} onChange={handleInputChange} />
            </div>
          </>
        )}

        <div className={styles.buttonGroup}>
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
