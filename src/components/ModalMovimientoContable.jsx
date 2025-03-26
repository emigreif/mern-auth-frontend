import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import styles from "../styles/modals/GlobalModal.module.css";

export default function ModalMovimientoContable({
  mode = "create",
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
    if (token) {
      fetchCombos();
    }
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
    } catch (err) {
      setErrorMsg("Error al cargar datos");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm({ ...form, [name]: val });
  };

  const handlePartidaChange = (index, field, value) => {
    const updated = [...form.partidasObra];
    updated[index][field] = value;
    setForm({ ...form, partidasObra: updated });
  };

  const addPartida = () => {
    setForm({ ...form, partidasObra: [...form.partidasObra, { obra: "", monto: 0 }] });
  };

  const removePartida = (index) => {
    const updated = [...form.partidasObra];
    updated.splice(index, 1);
    setForm({ ...form, partidasObra: updated });
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

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const esCheque = form.tipo === "CHEQUE_EMITIDO" || form.tipo === "CHEQUE_RECIBIDO";
  const esTransferencia = form.tipo === "TRANSFERENCIA_EMITIDA" || form.tipo === "TRANSFERENCIA_RECIBIDA";

  return (
    <ModalBase
      isOpen={true}
      onClose={onClose}
      title={mode === "edit" ? "Editar Movimiento" : "Nuevo Movimiento Contable"}
    >
      <form onSubmit={handleSubmit} className={styles.formBase}>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <label>Tipo</label>
        <select name="tipo" value={form.tipo} onChange={handleChange}>
          {[
            "FACTURA_EMITIDA",
            "PAGO_RECIBIDO",
            "EFECTIVO_RECIBIDO",
            "CHEQUE_RECIBIDO",
            "TRANSFERENCIA_RECIBIDA",
            "FACTURA_RECIBIDA",
            "PAGO_EMITIDO",
            "EFECTIVO_EMITIDO",
            "CHEQUE_EMITIDO",
            "TRANSFERENCIA_EMITIDA"
          ].map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <label>Monto</label>
        <input type="number" name="monto" value={form.monto} onChange={handleChange} required />

        <label>Fecha</label>
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />

        <label>¿Con factura?</label>
        <input type="checkbox" name="esConFactura" checked={form.esConFactura} onChange={handleChange} />

        <label>Proveedor</label>
        <select name="idProveedor" value={form.idProveedor} onChange={handleChange}>
          <option value="">-- Seleccionar --</option>
          {proveedores.map(p => (
            <option key={p._id} value={p._id}>{p.nombre}</option>
          ))}
        </select>

        <label>Cliente</label>
        <select name="idCliente" value={form.idCliente} onChange={handleChange}>
          <option value="">-- Seleccionar --</option>
          {clientes.map(c => (
            <option key={c._id} value={c._id}>{c.nombre}</option>
          ))}
        </select>

        <label>Descripción</label>
        <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} />

        <label>Sub-Índice Factura</label>
        <input type="text" name="subIndiceFactura" value={form.subIndiceFactura} onChange={handleChange} />

        {esCheque && (
          <>
            <h4>Datos del Cheque</h4>
            <label>Número Cheque</label>
            <input
              type="text"
              name="numeroCheque"
              value={form.datosCheque.numeroCheque}
              onChange={(e) =>
                setForm({ ...form, datosCheque: { ...form.datosCheque, numeroCheque: e.target.value } })
              }
            />
            <label>Banco</label>
            <input
              type="text"
              name="banco"
              value={form.datosCheque.banco}
              onChange={(e) =>
                setForm({ ...form, datosCheque: { ...form.datosCheque, banco: e.target.value } })
              }
            />
            <label>Fecha Vencimiento</label>
            <input
              type="date"
              name="fechaVencimiento"
              value={form.datosCheque.fechaVencimiento}
              onChange={(e) =>
                setForm({ ...form, datosCheque: { ...form.datosCheque, fechaVencimiento: e.target.value } })
              }
            />
            {form.tipo === "CHEQUE_EMITIDO" && (
              <>
                <label>Endosado A</label>
                <input
                  type="text"
                  name="endosadoA"
                  value={form.datosCheque.endosadoA}
                  onChange={(e) =>
                    setForm({ ...form, datosCheque: { ...form.datosCheque, endosadoA: e.target.value } })
                  }
                />
              </>
            )}
          </>
        )}

        {esTransferencia && (
          <>
            <h4>Datos de Transferencia</h4>
            <label>Número Comprobante</label>
            <input
              type="text"
              name="numeroComprobante"
              value={form.datosTransferencia.numeroComprobante}
              onChange={(e) =>
                setForm({ ...form, datosTransferencia: { ...form.datosTransferencia, numeroComprobante: e.target.value } })
              }
            />
            <label>Banco Origen</label>
            <input
              type="text"
              name="bancoOrigen"
              value={form.datosTransferencia.bancoOrigen}
              onChange={(e) =>
                setForm({ ...form, datosTransferencia: { ...form.datosTransferencia, bancoOrigen: e.target.value } })
              }
            />
            <label>Banco Destino</label>
            <input
              type="text"
              name="bancoDestino"
              value={form.datosTransferencia.bancoDestino}
              onChange={(e) =>
                setForm({ ...form, datosTransferencia: { ...form.datosTransferencia, bancoDestino: e.target.value } })
              }
            />
            <label>Fecha Acreditación</label>
            <input
              type="date"
              name="fechaAcreditacion"
              value={form.fechaAcreditacion}
              onChange={handleChange}
            />
          </>
        )}

        <h4>Partidas por Obra</h4>
        {form.partidasObra.map((p, i) => (
          <div key={i} className={styles.partidaRow}>
            <select
              value={p.obra}
              onChange={(e) => handlePartidaChange(i, "obra", e.target.value)}
            >
              <option value="">-- Seleccionar Obra --</option>
              {obras.map((o) => (
                <option key={o._id} value={o._id}>{o.nombre}</option>
              ))}
            </select>
            <input
              type="number"
              value={p.monto}
              onChange={(e) => handlePartidaChange(i, "monto", e.target.value)}
            />
            <button type="button" onClick={() => removePartida(i)}>X</button>
          </div>
        ))}
        <button type="button" onClick={addPartida}>+ Agregar Partida</button>

        <div className={styles.actions}>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </ModalBase>
  );
}
