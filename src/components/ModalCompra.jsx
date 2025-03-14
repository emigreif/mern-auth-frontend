// frontend/src/components/ModalCompra.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import * as XLSX from "xlsx";

export default function ModalCompra({ editingCompra, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const isEdit = !!editingCompra;
  const [errorMsg, setErrorMsg] = useState("");
  const [obras, setObras] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [tipo, setTipo] = useState("aluminio"); // por defecto
  const [form, setForm] = useState({
    proveedor: "",
    obra: "",
    fechaEstimadaEntrega: "",
    factura: "",
    remito: "",
    lugarEntrega: "",
    direccionEntrega: "",
    tratamiento: "",
    pedido: [],     // Aluminio
    vidrios: [],    // Vidrios
    accesorios: [], // Accesorios
  });

  useEffect(() => {
    fetchObras();
    fetchProveedores();
    if (isEdit) {
      // Cargar la compra actual
      loadCompra(editingCompra);
    }
  }, []);

  const fetchObras = async () => { /* ...similar a antes... */ };
  const fetchProveedores = async () => { /* ...similar a antes... */ };

  const loadCompra = (compra) => {
    setTipo(compra.tipo);
    setForm({
      proveedor: compra.proveedor?._id || "",
      obra: compra.obra?._id || "",
      fechaEstimadaEntrega: compra.fechaEstimadaEntrega?.slice(0,10) || "",
      factura: compra.factura || "",
      remito: "", // normal
      lugarEntrega: compra.lugarEntrega || "",
      direccionEntrega: compra.direccionEntrega || "",
      tratamiento: compra.tratamiento || "",
      pedido: compra.pedido || [],
      vidrios: compra.vidrios || [],
      accesorios: compra.accesorios || [],
    });
  };

  // Manejo de inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejo de arrays (pedido, vidrios, accesorios)
  // Igual que en la respuesta anterior

  // Importar Excel
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // parsear la info => { codigo, descripcion, etc. }
      // ejemplo: supongamos que la fila 0 es header
      const items = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;
        // row[0] => código, row[1] => descripción, etc.
        items.push({
          codigo: row[0],
          descripcion: row[1],
          largo: parseFloat(row[2]) || 0,
          cantidad: parseFloat(row[3]) || 0,
          // ...
        });
      }
      // set en form => si tipo = "aluminio", set form.pedido = items
      if (tipo === "aluminio") {
        setForm((prev) => ({ ...prev, pedido: items }));
      } else if (tipo === "vidrios") {
        // parse a la estructura de vidrios
      } else if (tipo === "accesorios") {
        // parse a la estructura de accesorios
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(ev) => ev.stopPropagation()}>
        <h2>{isEdit ? "Editar Compra" : "Nueva Compra"}</h2>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          {/* Seleccionar tipo (si no edit) */}
          {!isEdit && (
            <div className="form-group">
              <label>Tipo de Compra</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="aluminio">Aluminio</option>
                <option value="vidrios">Vidrios</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Proveedor</label>
            <select name="proveedor" value={form.proveedor} onChange={handleChange} required>
              <option value="">-- Seleccionar --</option>
              {proveedores.map((p) => (
                <option key={p._id} value={p._id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Obra</label>
            <select name="obra" value={form.obra} onChange={handleChange} required>
              <option value="">-- Seleccionar --</option>
              {obras.map((o) => (
                <option key={o._id} value={o._id}>{o.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha Estimada Entrega</label>
            <input
              type="date"
              name="fechaEstimadaEntrega"
              value={form.fechaEstimadaEntrega}
              onChange={handleChange}
            />
          </div>

          {/* ... Campos extra, PDF, etc. */}
          {/* Botón para subir Excel */}
          <div className="form-group">
            <label>Importar Ítems desde Excel</label>
            <input type="file" accept=".xlsx,.xls" onChange={handleImportExcel} />
          </div>

          {/* Muestra los arrays en sub-formularios */}
          {/* ...similar a la lógica anterior... */}

          <div style={{ marginTop: "1rem" }}>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
