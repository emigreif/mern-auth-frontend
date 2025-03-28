// src/components/modals/modalCompra.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import ModalNuevoProveedor from "./ModalNuevoProveedor.jsx";
import Button from "./ui/Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

export default function ModalCompra({ editingCompra, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  const isEdit = !!editingCompra;
  const [errorMsg, setErrorMsg] = useState("");
  const [obras, setObras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [showProvModal, setShowProvModal] = useState(false);
  
  const [tipo, setTipo] = useState("aluminio");
  const [form, setForm] = useState({
    proveedor: "",
    obra: "",
    fechaEstimadaEntrega: "",
    factura: "",
    remito: "",
    lugarEntrega: "",
    direccionEntrega: "",
    tratamiento: "",
    pedido: [],
    vidrios: [],
    accesorios: []
  });
  
  useEffect(() => {
    fetchObras();
    fetchProveedores();
    if (isEdit) {
      loadCompra(editingCompra);
    }
  }, [token]);
  
  const fetchObras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setObras(data);
    } catch (error) {
      console.error("Error fetching obras", error);
    }
  };
  
  const fetchProveedores = async () => {
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error fetching proveedores", error);
    }
  };
  
  const loadCompra = (compra) => {
    setTipo(compra.tipo);
    setForm({
      proveedor: compra.proveedor?._id || "",
      obra: compra.obra?._id || "",
      fechaEstimadaEntrega: compra.fechaEstimadaEntrega?.slice(0, 10) || "",
      factura: compra.factura || "",
      remito: compra.remito || "",
      lugarEntrega: compra.lugarEntrega || "",
      direccionEntrega: compra.direccionEntrega || "",
      tratamiento: compra.tratamiento || "",
      pedido: compra.pedido || [],
      vidrios: compra.vidrios || [],
      accesorios: compra.accesorios || []
    });
  };
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const items = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;
        items.push({
          codigo: row[0],
          descripcion: row[1],
          largo: parseFloat(row[2]) || 0,
          cantidad: parseFloat(row[3]) || 0
        });
      }
      if (tipo === "aluminio") {
        setForm((prev) => ({ ...prev, pedido: items }));
      } else if (tipo === "vidrios") {
        setForm((prev) => ({ ...prev, vidrios: items }));
      } else if (tipo === "accesorios") {
        setForm((prev) => ({ ...prev, accesorios: items }));
      }
    } catch (error) {
      setErrorMsg("Error al importar Excel");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      let url = `${API_URL}/api/compras/${tipo}`;
      let method = "POST";
      if (isEdit) {
        url = `${API_URL}/api/compras/${tipo}/${editingCompra._id}`;
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
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar compra");
      }
      await res.json();
      onSaved();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };
  
  return (
    <ModalBase isOpen={true} onClose={onClose} title={isEdit ? "Editar Compra" : "Nueva Compra"}>
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
        {!isEdit && (
          <div className={styles.formGroup}>
            <label>Tipo de Compra</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="aluminio">Aluminio</option>
              <option value="vidrios">Vidrios</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
        )}
        <div className={styles.formGroup}>
          <label>Proveedor (requerido)</label>
          <div className={styles.flexRow}>
            <select name="proveedor" value={form.proveedor} onChange={handleChange} required>
              <option value="">-- Seleccionar --</option>
              {proveedores.map((p) => (
                <option key={p._id} value={p._id}>{p.nombre}</option>
              ))}
            </select>
            <Button onClick={() => setShowProvModal(true)}>+ Agregar</Button>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Obra (requerido)</label>
          <div className={styles.flexRow}>
            <select name="obra" value={form.obra} onChange={handleChange} required>
              <option value="">-- Seleccionar --</option>
              {obras.map((o) => (
                <option key={o._id} value={o._id}>{o.nombre}</option>
              ))}
            </select>
            <Button onClick={() => { /* Acción para agregar obra */ }}>+ Agregar</Button>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Fecha Estimada Entrega</label>
          <input type="date" name="fechaEstimadaEntrega" value={form.fechaEstimadaEntrega} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Factura</label>
          <input type="text" name="factura" value={form.factura} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Remito</label>
          <input type="text" name="remito" value={form.remito} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Lugar de Entrega</label>
          <input type="text" name="lugarEntrega" value={form.lugarEntrega} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Dirección de Entrega</label>
          <input type="text" name="direccionEntrega" value={form.direccionEntrega} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Tratamiento</label>
          <input type="text" name="tratamiento" value={form.tratamiento} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Importar Ítems desde Excel</label>
          <input type="file" accept=".xlsx,.xls" onChange={handleImportExcel} />
        </div>
        <div className={styles.formActions}>
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
      {showProvModal && (
        <ModalNuevoProveedor
          onCreated={() => {
            setShowProvModal(false);
            fetchProveedores();
          }}
          onClose={() => setShowProvModal(false)}
        />
      )}
    </ModalBase>
  );
}
