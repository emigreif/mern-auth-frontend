// src/components/ModalPresupuesto.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "./Button.jsx";
import styles from "../styles/modals/GlobalModal.module.css";

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

  // Actualiza el total presupuestado al cambiar los totales de factura
  useEffect(() => {
    const cf = parseFloat(form.totalConFactura) || 0;
    const sf = parseFloat(form.totalSinFactura) || 0;
    setForm(prev => ({
      ...prev,
      totalPresupuestado: cf + sf
    }));
  }, [form.totalConFactura, form.totalSinFactura]);

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
      await res.json();
      onSaved(true);
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={editingPresupuesto ? "Editar Presupuesto" : "Nuevo Presupuesto"}>
      <form onSubmit={handleSubmit} className={styles.formBase} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <div className={styles.formGroup}>
          <label>Nombre Obra <span>*</span></label>
          <input type="text" name="nombreObra" value={form.nombreObra} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Cliente</label>
          <div style={{ display: "flex", gap: "10px" }}>
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
        </div>

        <div className={styles.formGroup}>
          <label>Total c/F</label>
          <input type="number" name="totalConFactura" value={form.totalConFactura} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Total s/F</label>
          <input type="number" name="totalSinFactura" value={form.totalSinFactura} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Total Presupuestado</label>
          <input type="number" value={form.totalPresupuestado} readOnly />
        </div>

        <div className={styles.formGroup}>
          <label>Dirección <span>*</span></label>
          <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Fecha de Entrega</label>
          <input type="date" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Descripción / Observaciones</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
        </div>

        <div className={styles.flexRowEnd}>
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
