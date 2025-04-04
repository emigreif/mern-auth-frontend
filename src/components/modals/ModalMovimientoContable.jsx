// src/components/modals/ModalMovimientoContable.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import ErrorText from "../ui/ErrorText.jsx";

export default function ModalMovimientoContable({
  mode = "create",
  isOpen = true,
  movimiento = null,
  proveedorId = null,
  clienteId = null,
  obraId = null,
  onClose,
  onSuccess
}) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    tipo: "FACTURA_RECIBIDA",
    monto: 0,
    esConFactura: false,
    fecha: new Date().toISOString().slice(0, 10),
    fechaAcreditacion: "",
    descripcion: "",
    subIndiceFactura: "",
    partidasObra: obraId ? [{ obra: obraId, monto: 0 }] : [],
    datosCheque: {
      numeroCheque: "",
      banco: "",
      fechaVencimiento: "",
      endosadoA: "",
      estadoCheque: "pendiente"
    },
    datosTransferencia: {
      numeroComprobante: "",
      bancoOrigen: "",
      bancoDestino: ""
    },
    idProveedor: proveedorId || "",
    idCliente: clienteId || ""
  });

  const [obras, setObras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (token) fetchCombos();
  }, [token]);

  useEffect(() => {
    if (mode === "edit" && movimiento) {
      setForm({
        tipo: movimiento.tipo,
        monto: movimiento.monto,
        esConFactura: movimiento.esConFactura || false,
        fecha: movimiento.fecha?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        fechaAcreditacion: movimiento.fechaAcreditacion?.slice(0, 10) || "",
        descripcion: movimiento.descripcion || "",
        subIndiceFactura: movimiento.subIndiceFactura || "",
        partidasObra: movimiento.partidasObra || [],
        datosCheque: movimiento.datosCheque || {
          numeroCheque: "",
          banco: "",
          fechaVencimiento: "",
          endosadoA: "",
          estadoCheque: "pendiente"
        },
        datosTransferencia: movimiento.datosTransferencia || {
          numeroComprobante: "",
          bancoOrigen: "",
          bancoDestino: ""
        },
        idProveedor: movimiento.idProveedor?._id || "",
        idCliente: movimiento.idCliente?._id || ""
      });
    }
  }, [movimiento, mode]);

  const fetchCombos = async () => {
    try {
      const [resObras, resProvs, resClientes] = await Promise.all([
        fetch(`${API_URL}/api/obras`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/proveedores`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/clientes`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [obrasData, provsData, clientesData] = await Promise.all([
        resObras.json(),
        resProvs.json(),
        resClientes.json(),
      ]);
      setObras(obrasData);
      setProveedores(provsData);
      setClientes(clientesData);
    } catch {
      setErrorMsg("Error al cargar datos");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handlePartidaChange = (index, field, value) => {
    const updated = [...form.partidasObra];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, partidasObra: updated }));
  };

  const addPartida = () => {
    setForm((prev) => ({
      ...prev,
      partidasObra: [...prev.partidasObra, { obra: "", monto: 0 }]
    }));
  };

  const removePartida = (index) => {
    const updated = [...form.partidasObra];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, partidasObra: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.fecha || form.monto <= 0) {
      setErrorMsg("Fecha y monto válidos son obligatorios");
      return;
    }

    const body = {
      ...form,
      monto: parseFloat(form.monto),
      partidasObra: form.partidasObra.map(p => ({
        obra: p.obra,
        monto: parseFloat(p.monto || 0)
      }))
    };

    if (form.fechaAcreditacion) {
      body.fechaAcreditacion = new Date(form.fechaAcreditacion);
    }

    try {
      const url = mode === "edit"
        ? `${API_URL}/api/contabilidad/${movimiento._id}`
        : `${API_URL}/api/contabilidad`;
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar");
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const tipos = [
    "FACTURA_EMITIDA", "PAGO_RECIBIDO", "EFECTIVO_RECIBIDO", "CHEQUE_RECIBIDO", "TRANSFERENCIA_RECIBIDA",
    "FACTURA_RECIBIDA", "PAGO_EMITIDO", "EFECTIVO_EMITIDO", "CHEQUE_EMITIDO", "TRANSFERENCIA_EMITIDA"
  ];

  const esCheque = form.tipo.includes("CHEQUE");
  const esTransferencia = form.tipo.includes("TRANSFERENCIA");

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={mode === "edit" ? "Editar Movimiento" : "Nuevo Movimiento Contable"}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <ErrorText>{errorMsg}</ErrorText>

        <Select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} options={tipos} />
        <Input type="number" label="Monto" name="monto" value={form.monto} onChange={handleChange} required />
        <Input type="date" label="Fecha" name="fecha" value={form.fecha} onChange={handleChange} required />
        <label>
          <input type="checkbox" name="esConFactura" checked={form.esConFactura} onChange={handleChange} />
          ¿Con factura?
        </label>

        <Select
          label="Proveedor"
          name="idProveedor"
          value={form.idProveedor}
          onChange={handleChange}
          options={["", ...proveedores.map(p => ({ label: p.nombre, value: p._id }))]}
        />

        <Select
          label="Cliente"
          name="idCliente"
          value={form.idCliente}
          onChange={handleChange}
          options={["", ...clientes.map(c => ({ label: c.nombre, value: c._id }))]}
        />

        <Input label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} />
        <Input label="Sub-Índice Factura" name="subIndiceFactura" value={form.subIndiceFactura} onChange={handleChange} />

        {esCheque && (
          <>
            <h4>Datos del Cheque</h4>
            <Input label="Número Cheque" value={form.datosCheque.numeroCheque} onChange={(e) =>
              setForm((prev) => ({ ...prev, datosCheque: { ...prev.datosCheque, numeroCheque: e.target.value } }))} />
            <Input label="Banco" value={form.datosCheque.banco} onChange={(e) =>
              setForm((prev) => ({ ...prev, datosCheque: { ...prev.datosCheque, banco: e.target.value } }))} />
            <Input type="date" label="Fecha Vencimiento" value={form.datosCheque.fechaVencimiento} onChange={(e) =>
              setForm((prev) => ({ ...prev, datosCheque: { ...prev.datosCheque, fechaVencimiento: e.target.value } }))} />
            {form.tipo === "CHEQUE_EMITIDO" && (
              <Input label="Endosado A" value={form.datosCheque.endosadoA} onChange={(e) =>
                setForm((prev) => ({ ...prev, datosCheque: { ...prev.datosCheque, endosadoA: e.target.value } }))} />
            )}
          </>
        )}

        {esTransferencia && (
          <>
            <h4>Datos de Transferencia</h4>
            <Input label="Número Comprobante" value={form.datosTransferencia.numeroComprobante} onChange={(e) =>
              setForm((prev) => ({ ...prev, datosTransferencia: { ...prev.datosTransferencia, numeroComprobante: e.target.value } }))} />
            <Input label="Banco Origen" value={form.datosTransferencia.bancoOrigen} onChange={(e) =>
              setForm((prev) => ({ ...prev, datosTransferencia: { ...prev.datosTransferencia, bancoOrigen: e.target.value } }))} />
            <Input label="Banco Destino" value={form.datosTransferencia.bancoDestino} onChange={(e) =>
              setForm((prev) => ({ ...prev, datosTransferencia: { ...prev.datosTransferencia, bancoDestino: e.target.value } }))} />
            <Input type="date" label="Fecha Acreditación" name="fechaAcreditacion" value={form.fechaAcreditacion} onChange={handleChange} />
          </>
        )}

        <h4>Partidas por Obra</h4>
        {form.partidasObra.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Select
              name={`obra-${i}`}
              value={p.obra}
              onChange={(e) => handlePartidaChange(i, "obra", e.target.value)}
              options={["", ...obras.map(o => ({ label: o.nombre, value: o._id }))]}
            />
            <Input
              type="number"
              value={p.monto}
              onChange={(e) => handlePartidaChange(i, "monto", e.target.value)}
              placeholder="Monto"
            />
            <Button type="button" onClick={() => removePartida(i)}>X</Button>
          </div>
        ))}
        <Button type="button" onClick={addPartida}>+ Agregar Partida</Button>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
