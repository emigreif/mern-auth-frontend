import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/modals/NuevoCliente.module.css"; // ✅ Importamos el CSS

export default function NuevoCliente({ onCreated, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Estado del formulario
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

    // Validaciones
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
    <>
      {/* Fondo oscuro detrás del modal */}
      <div className={styles.overlay} onClick={onClose}></div>

      {/* Contenedor del modal */}
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>Agregar Nuevo Cliente</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <div>
            <label>Nombre <span>*</span></label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Apellido <span>*</span></label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Email <span>*</span></label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Dirección - Calle</label>
            <input
              type="text"
              name="direccion.calle"
              value={form.direccion.calle}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Dirección - Ciudad</label>
            <input
              type="text"
              name="direccion.ciudad"
              value={form.direccion.ciudad}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Condición Fiscal</label>
            <select
              name="condicionFiscal"
              value={form.condicionFiscal}
              onChange={handleInputChange}
            >
              <option value="consumidorFinal">Consumidor Final</option>
              <option value="responsableInscripto">Responsable Inscripto</option>
            </select>
          </div>

          {/* Campos adicionales si es Responsable Inscripto */}
          {form.condicionFiscal === "responsableInscripto" && (
            <>
              <div>
                <label>Razón Social <span>*</span></label>
                <input
                  type="text"
                  name="razonSocial"
                  value={form.razonSocial}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>CUIT <span>*</span></label>
                <input
                  type="text"
                  name="cuit"
                  value={form.cuit}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>Guardar</button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </>
  );
}
