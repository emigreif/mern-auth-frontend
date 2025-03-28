// src/components/modals/modalNuevoEmpleado.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "./Button.jsx";
import styles from "../styles/modals/GlobalModal.module.css";

export default function ModalNuevoEmpleado({ onCreated, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    direccion: "",
    puesto: "",
    salario: 0,
    activo: true
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (name === "salario") {
      setForm({ ...form, salario: parseFloat(value) || 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validaciones mínimas
    if (!form.nombre.trim() || !form.apellido.trim() || !form.dni.trim()) {
      setErrorMsg("Los campos nombre, apellido y dni son requeridos.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear empleado");
      }
      await res.json();
      if (onCreated) onCreated();
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title="Nuevo Empleado">
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <div className={styles.formGroup}>
          <label>Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Apellido</label>
          <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>DNI</label>
          <input type="text" name="dni" value={form.dni} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Dirección</label>
          <input type="text" name="direccion" value={form.direccion} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Puesto</label>
          <input type="text" name="puesto" value={form.puesto} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Salario</label>
          <input type="number" name="salario" value={form.salario} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Activo</label>
          <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
        </div>

        <div className={styles.actions}>
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
