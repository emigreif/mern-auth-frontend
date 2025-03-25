// src/components/ModalPresupuesto.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import ModalNuevoCliente from "./ModalNuevoCliente.jsx"; // ✅ Importamos el modal de nuevo cliente

export default function ModalPresupuesto({
  editingPresupuesto,
  onClose,
  onSaved
}) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Estados
  const [clientes, setClientes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false); // ✅ Modal de cliente

  // Formulario
  const [form, setForm] = useState({
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

  useEffect(() => {
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
        fechaEntrega: editingPresupuesto.fechaEntrega?.slice(0,10) || "",
        descripcion: editingPresupuesto.descripcion || ""
      });
    }
  }, [editingPresupuesto]);

  useEffect(() => {
    const cf = parseFloat(form.totalConFactura) || 0;
    const sf = parseFloat(form.totalSinFactura) || 0;
    setForm((prev) => ({
      ...prev,
      totalPresupuestado: cf + sf
    }));
  }, [form.totalConFactura, form.totalSinFactura]);

  const fetchClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setClientes(await res.json());
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

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
      if (editingPresupuesto) {
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
      if (!res.ok) throw new Error("Error al guardar presupuesto");

      if (onSaved) onSaved(true);
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // ✅ Función que se ejecuta cuando se crea un nuevo cliente
  const handleClienteCreado = async () => {
    setIsClienteModalOpen(false);
    await fetchClientes();
  };

  return (
    <>
      <ModalBase isOpen={true} onClose={onClose} title={editingPresupuesto ? "Editar Presupuesto" : "Nuevo Presupuesto"}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          <div>
            <label>Nombre Obra <span style={{color: "red"}}>*</span></label>
            <input type="text" name="nombreObra" value={form.nombreObra} onChange={handleChange} required />
          </div>

          {/* Cliente + Botón Nuevo Cliente */}
          <div>
            <label>Cliente</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select name="cliente" value={form.cliente} onChange={handleChange}>
                <option value="">-- Sin cliente --</option>
                {clientes.map((c) => (
                  <option key={c._id} value={c._id}>{c.nombre} {c.apellido}</option>
                ))}
              </select>
              <button type="button" onClick={() => setIsClienteModalOpen(true)}>➕ Nuevo Cliente</button>
            </div>
          </div>

          {/* Totales */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ flex: 1 }}>
              <label>Total c/F</label>
              <input type="number" name="totalConFactura" value={form.totalConFactura} onChange={handleChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Total s/F</label>
              <input type="number" name="totalSinFactura" value={form.totalSinFactura} onChange={handleChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Total Presupuestado</label>
              <input type="number" value={form.totalPresupuestado} readOnly />
            </div>
          </div>

          <div>
            <label>Dirección <span style={{color: "red"}}>*</span></label>
            <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required />
          </div>

          <div>
            <label>Fecha de Entrega</label>
            <input type="date" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} />
          </div>

          <div>
            <label>Descripción / Observaciones</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </ModalBase>

      {/* ✅ Modal de Nuevo Cliente */}
      {isClienteModalOpen && (
        <ModalNuevoCliente onCreated={handleClienteCreado} onClose={() => setIsClienteModalOpen(false)} />
      )}
    </>
  );
}
