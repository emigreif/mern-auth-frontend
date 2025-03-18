// src/components/NuevoCliente/NuevoCliente.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function NuevoCliente({ onCreated, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Agregamos condicionFiscal, razonSocial, cuit
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

    // Validación mínima
    if (!form.nombre.trim() || !form.apellido.trim() || !form.email.trim()) {
      setErrorMsg("Los campos nombre, apellido y email son requeridos.");
      return;
    }
    // Si es responsable inscripto, pedimos razonSocial y cuit
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
    <form onSubmit={handleSubmit}>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <div>
        <label>Nombre (requerido)</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Apellido (requerido)</label>
        <input
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Email (requerido)</label>
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

      {/* Mostrar razonSocial y cuit solo si es responsableInscripto */}
      {form.condicionFiscal === "responsableInscripto" && (
        <>
          <div>
            <label>Razón Social (requerido)</label>
            <input
              type="text"
              name="razonSocial"
              value={form.razonSocial}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>CUIT (requerido)</label>
            <input
              type="text"
              name="cuit"
              value={form.cuit}
              onChange={handleInputChange}
            />
          </div>
        </>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}
