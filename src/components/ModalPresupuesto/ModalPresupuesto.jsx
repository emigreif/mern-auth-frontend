// src/components/ModalPresupuesto/ModalPresupuesto.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "../ModalBase/ModalBase.jsx";

/**
 * Props:
 * - editingPresupuesto (obj/null): si existe, es edición; si null, es creación
 * - onClose (func): cierra el modal
 * - onSaved (func): callback tras guardar => onSaved(true) para recargar
 */
export default function ModalPresupuesto({
  editingPresupuesto,
  onClose,
  onSaved
}) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Para distinguir si es edición o creación
  const isEdit = !!editingPresupuesto;

  // Lista de clientes (para un <select>)
  const [clientes, setClientes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Form
  const [form, setForm] = useState({
    nombreObra: "",
    cliente: "",
    estado: "pendiente",       // pendiente, aprobado, perdido
    empresaPerdida: "",
    totalConFactura: 0,
    totalSinFactura: 0,
    totalPresupuestado: 0,     // se calcula
    direccion: "",
    fechaEntrega: "",
    descripcion: ""
  });

  // Al montar (o al cambiar editingPresupuesto), llenamos form
  useEffect(() => {
    // Cargar la lista de clientes
    fetchClientes();

    if (editingPresupuesto) {
      setForm({
        nombreObra: editingPresupuesto.nombreObra || "",
        cliente: editingPresupuesto.cliente?._id || "",
        estado: editingPresupuesto.estado || "pendiente",
        empresaPerdida: editingPresupuesto.empresaPerdida || "",
        totalConFactura: editingPresupuesto.totalConFactura || 0,
        totalSinFactura: editingPresupuesto.totalSinFactura || 0,
        totalPresupuestado: editingPresupuesto.totalPresupuestado || 0,
        direccion: editingPresupuesto.direccion || "",
        fechaEntrega: editingPresupuesto.fechaEntrega
          ? editingPresupuesto.fechaEntrega.slice(0,10)
          : "",
        descripcion: editingPresupuesto.descripcion || ""
      });
    } else {
      // Creación => limpiar
      setForm({
        nombreObra: "",
        cliente: "",
        estado: "pendiente",
        empresaPerdida: "",
        totalConFactura: 0,
        totalSinFactura: 0,
        totalPresupuestado: 0,
        direccion: "",
        fechaEntrega: "",
        descripcion: ""
      });
    }
  }, [editingPresupuesto]);

  // Recalcular totalPresupuestado al cambiar totalConFactura o totalSinFactura
  useEffect(() => {
    const cf = parseFloat(form.totalConFactura) || 0;
    const sf = parseFloat(form.totalSinFactura) || 0;
    setForm((prev) => ({
      ...prev,
      totalPresupuestado: cf + sf
    }));
  }, [form.totalConFactura, form.totalSinFactura]);

  // Cargar clientes
  const fetchClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClientes(data);
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Guardar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validaciones mínimas
    if (!form.nombreObra.trim()) {
      setErrorMsg("El campo 'Nombre Obra' es obligatorio.");
      return;
    }
    if (!form.direccion.trim()) {
      setErrorMsg("El campo 'Dirección' es obligatorio.");
      return;
    }

    try {
      let url = `${API_URL}/api/presupuestos`;
      let method = "POST";
      if (isEdit) {
        url = `${API_URL}/api/presupuestos/${editingPresupuesto._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al guardar presupuesto");
      }
      await res.json();
      if (onSaved) onSaved(true);
      onClose(false);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <ModalBase
      isOpen={true}
      onClose={() => onClose(false)}
      title={isEdit ? "Editar Presupuesto" : "Nuevo Presupuesto"}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        {/* Nombre Obra */}
        <div>
          <label>Nombre Obra <span style={{color: "red"}}>*</span></label>
          <input
            type="text"
            name="nombreObra"
            value={form.nombreObra}
            onChange={handleChange}
            required
          />
        </div>

        {/* Cliente */}
        <div>
          <label>Cliente</label>
          <select name="cliente" value={form.cliente} onChange={handleChange}>
            <option value="">-- Sin cliente --</option>
            {clientes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nombre} {c.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="perdido">Perdido</option>
          </select>
        </div>

        {/* Empresa Perdida (opcional, si estado=perdido) */}
        {form.estado === "perdido" && (
          <div>
            <label>Empresa que ganó (competencia)</label>
            <input
              type="text"
              name="empresaPerdida"
              value={form.empresaPerdida}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Totales */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <label>Total c/F</label>
            <input
              type="number"
              name="totalConFactura"
              value={form.totalConFactura}
              onChange={handleChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Total s/F</label>
            <input
              type="number"
              name="totalSinFactura"
              value={form.totalSinFactura}
              onChange={handleChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Total Presupuestado</label>
            <input
              type="number"
              value={form.totalPresupuestado}
              readOnly
            />
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label>Dirección <span style={{color: "red"}}>*</span></label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            required
          />
        </div>

        {/* Fecha Entrega */}
        <div>
          <label>Fecha de Entrega</label>
          <input
            type="date"
            name="fechaEntrega"
            value={form.fechaEntrega}
            onChange={handleChange}
          />
        </div>

        {/* Descripción */}
        <div>
          <label>Descripción / Observaciones</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>

        {/* Botones */}
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button type="submit" style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "0.6rem 1rem", borderRadius: "4px", cursor: "pointer" }}>
            {isEdit ? "Actualizar" : "Guardar"}
          </button>
          <button
            type="button"
            style={{ backgroundColor: "#6c757d", color: "#fff", border: "none", padding: "0.6rem 1rem", borderRadius: "4px", cursor: "pointer" }}
            onClick={() => onClose(false)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
