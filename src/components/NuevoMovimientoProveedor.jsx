// frontend/src/components/NuevoMovimientoProveedor.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Muestra un modal para crear un nuevo movimiento contable
 * (factura o pago) asociado a un proveedor.
 */
export default function NuevoMovimientoProveedor({ proveedorId, onSuccess, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    tipo: "FACTURA_RECIBIDA", // Ej. default
    monto: 0,
    fecha: "",
    descripcion: "",
    subIndiceFactura: "",
    partidasObra: []
  });
  const [obras, setObras] = useState([]); // Para mostrar en select
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (token) {
      fetchObras();
    }
  }, [token]);

  const fetchObras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener obras");
      const data = await res.json();
      setObras(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPartida = () => {
    setForm((prev) => ({
      ...prev,
      partidasObra: [...prev.partidasObra, { obra: "", monto: 0 }]
    }));
  };

  const handlePartidaChange = (index, field, value) => {
    const newPartidas = [...form.partidasObra];
    newPartidas[index] = { ...newPartidas[index], [field]: value };
    setForm({ ...form, partidasObra: newPartidas });
  };

  const removePartida = (index) => {
    const newPartidas = [...form.partidasObra];
    newPartidas.splice(index, 1);
    setForm({ ...form, partidasObra: newPartidas });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (!form.fecha) {
        setErrorMsg("La fecha es obligatoria");
        return;
      }
      // Convertir a number
      const finalBody = {
        ...form,
        monto: parseFloat(form.monto),
        idProveedor: proveedorId,
        partidasObra: form.partidasObra.map((p) => ({
          obra: p.obra,
          monto: parseFloat(p.monto || 0)
        }))
      };

      const res = await fetch(`${API_URL}/api/contabilidad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(finalBody)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al crear movimiento");
      }
      await res.json();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Nuevo Movimiento (Proveedor)</h2>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo</label>
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="FACTURA_RECIBIDA">Factura Recibida</option>
              <option value="PAGO_EMITIDO">Pago Emitido</option>
              {/* Agrega más opciones si lo deseas */}
            </select>
          </div>
          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Monto Total</label>
            <input
              type="number"
              name="monto"
              value={form.monto}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Sub-Índice Factura</label>
            <input
              type="text"
              name="subIndiceFactura"
              value={form.subIndiceFactura}
              onChange={handleChange}
              placeholder="Ej: A, B, etc."
            />
          </div>

          <h3>Partidas por Obra</h3>
          {form.partidasObra.map((p, i) => (
            <div key={i} style={{ border: "1px solid #ccc", padding: "0.5rem", marginBottom: "0.5rem" }}>
              <label>Obra</label>
              {/* Idealmente un <select> con las obras del user */}
              <select
                value={p.obra}
                onChange={(e) => handlePartidaChange(i, "obra", e.target.value)}
              >
                <option value="">-- Seleccionar Obra --</option>
                {obras.map((o) => (
                  <option key={o._id} value={o._id}>{o.nombre}</option>
                ))}
              </select>

              <label>Monto</label>
              <input
                type="number"
                value={p.monto}
                onChange={(e) => handlePartidaChange(i, "monto", e.target.value)}
              />
              <button type="button" onClick={() => removePartida(i)}>X</button>
            </div>
          ))}
          <button type="button" onClick={addPartida}>+ Agregar Partida</button>

          <div style={{ marginTop: "1rem" }}>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
