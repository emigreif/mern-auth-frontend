import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

export default function ModalPresupuesto({ editingPresupuesto, onClose, onSaved, clientes, onAddCliente }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
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
        fechaEntrega: editingPresupuesto.fechaEntrega?.slice(0, 10) || "",
        descripcion: editingPresupuesto.descripcion || ""
      });
    }
  }, [editingPresupuesto]);

  useEffect(() => {
    const cf = parseFloat(form.totalConFactura) || 0;
    const sf = parseFloat(form.totalSinFactura) || 0;
    setForm(prev => ({
      ...prev,
      totalPresupuestado: cf + sf
    }));
  }, [form.totalConFactura, form.totalSinFactura]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.nombreObra.trim()) return setErrorMsg("El campo 'Nombre Obra' es obligatorio.");
    if (!form.direccion.trim()) return setErrorMsg("El campo 'Dirección' es obligatorio.");

    try {
      const url = editingPresupuesto
        ? `${API_URL}/api/presupuestos/${editingPresupuesto._id}`
        : `${API_URL}/api/presupuestos`;
      const method = editingPresupuesto ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Error al guardar presupuesto");

      await res.json();
      onSaved(true);
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={editingPresupuesto ? "Editar Presupuesto" : "Nuevo Presupuesto"}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

        <label>
          Nombre Obra *
          <input type="text" name="nombreObra" value={form.nombreObra} onChange={handleChange} required />
        </label>

        <label>
          Cliente
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select name="cliente" value={form.cliente} onChange={handleChange}>
              <option value="">-- Sin cliente --</option>
              {clientes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
            <Button onClick={onAddCliente}>➕ Nuevo Cliente</Button>
          </div>
        </label>

        <label>
          Total c/F
          <input type="number" name="totalConFactura" value={form.totalConFactura} onChange={handleChange} />
        </label>

        <label>
          Total s/F
          <input type="number" name="totalSinFactura" value={form.totalSinFactura} onChange={handleChange} />
        </label>

        <label>
          Total Presupuestado
          <input type="number" value={form.totalPresupuestado} readOnly />
        </label>

        <label>
          Dirección *
          <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required />
        </label>

        <label>
          Fecha de Entrega
          <input type="date" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} />
        </label>

        <label>
          Descripción / Observaciones
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
