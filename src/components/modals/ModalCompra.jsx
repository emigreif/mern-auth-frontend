// src/components/modals/ModalCompra.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import ModalNuevoProveedor from "./ModalNuevoProveedor.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

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
    accesorios: [],
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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
      accesorios: compra.accesorios || [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
          cantidad: parseFloat(row[3]) || 0,
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar compra");
      }

      await res.json();
      onSaved?.();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <ModalBase
      isOpen={true}
      onClose={onClose}
      title={isEdit ? "Editar Compra" : "Nueva Compra"}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <ErrorText>{errorMsg}</ErrorText>

        {!isEdit && (
          <Select
            label="Tipo de Compra"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            options={[
              { value: "aluminio", label: "Aluminio" },
              { value: "vidrios", label: "Vidrios" },
              { value: "accesorios", label: "Accesorios" },
            ]}
          />
        )}

        <Select
          label="Proveedor"
          value={form.proveedor}
          onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
          options={proveedores.map((p) => ({ value: p._id, label: p.nombre }))}
          required
        />
        <Button type="button" onClick={() => setShowProvModal(true)}>+ Agregar Proveedor</Button>

        <Select
          label="Obra"
          value={form.obra}
          onChange={(e) => setForm({ ...form, obra: e.target.value })}
          options={obras.map((o) => ({ value: o._id, label: o.nombre }))}
          required
        />

        <Input type="date" label="Fecha Estimada Entrega" name="fechaEstimadaEntrega" value={form.fechaEstimadaEntrega} onChange={handleChange} />
        <Input type="text" label="Factura" name="factura" value={form.factura} onChange={handleChange} />
        <Input type="text" label="Remito" name="remito" value={form.remito} onChange={handleChange} />
        <Input type="text" label="Lugar de Entrega" name="lugarEntrega" value={form.lugarEntrega} onChange={handleChange} />
        <Input type="text" label="Dirección de Entrega" name="direccionEntrega" value={form.direccionEntrega} onChange={handleChange} />
        <Input type="text" label="Tratamiento" name="tratamiento" value={form.tratamiento} onChange={handleChange} />

        <Input type="file" label="Importar Ítems desde Excel" onChange={handleImportExcel} />

        <div style={{ display: "flex", gap: "1rem" }}>
          <Button type="submit">Guardar</Button>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
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
