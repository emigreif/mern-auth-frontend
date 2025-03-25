// src/components/ModalNuevoEmpleado/ModalNuevoEmpleado.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

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
    <form onSubmit={handleSubmit}>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <div>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Apellido</label>
        <input
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>DNI</label>
        <input
          type="text"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
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
        <label>Dirección</label>
        <input
          type="text"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Puesto</label>
        <input
          type="text"
          name="puesto"
          value={form.puesto}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Salario</label>
        <input
          type="number"
          name="salario"
          value={form.salario}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Activo</label>
        <input
          type="checkbox"
          name="activo"
          checked={form.activo}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
