// src/components/NuevoMovimientoProveedor/NuevoMovimientoProveedor.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./NuevoMovimientoProveedor.module.css";

/**
 * Modal para crear un nuevo movimiento contable (factura/pago)
 * con tipos: CHEQUE_EMITIDO, EFECTIVO_EMITIDO, etc.
 * Props:
 *  - proveedorId
 *  - onSuccess
 *  - onClose
 */
export default function NuevoMovimientoProveedor({ proveedorId, onSuccess, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    tipo: "FACTURA_RECIBIDA",
    monto: 0,
    esConFactura: false,
    fecha: "",
    fechaAcreditacion: "",
    descripcion: "",
    subIndiceFactura: "",
    partidasObra: [],
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
    }
  });

  const [obras, setObras] = useState([]);
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
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleDatosChequeChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      datosCheque: { ...prev.datosCheque, [name]: value }
    }));
  };

  const handleDatosTransferenciaChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      datosTransferencia: { ...prev.datosTransferencia, [name]: value }
    }));
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

    if (!form.fecha) {
      setErrorMsg("La fecha del movimiento es obligatoria");
      return;
    }
    if (form.monto <= 0) {
      setErrorMsg("El monto debe ser mayor que 0");
      return;
    }

    try {
      const finalBody = {
        ...form,
        monto: parseFloat(form.monto),
        idProveedor: proveedorId,
        partidasObra: form.partidasObra.map((p) => ({
          obra: p.obra,
          monto: parseFloat(p.monto || 0)
        }))
      };

      if (form.fechaAcreditacion) {
        finalBody.fechaAcreditacion = new Date(form.fechaAcreditacion);
      }

      const res = await fetch(`${API_URL}/api/contabilidad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(finalBody)
      });
      if (!res.ok) {
        let errData = await res.json();
        throw new Error(errData.message || "Error al crear movimiento");
      }
      await res.json();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const esCheque = form.tipo === "CHEQUE_RECIBIDO" || form.tipo === "CHEQUE_EMITIDO";
  const esTransferencia = form.tipo === "TRANSFERENCIA_RECIBIDA" || form.tipo === "TRANSFERENCIA_EMITIDA";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Nuevo Movimiento Contable</h2>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <form onSubmit={handleSubmit} className={styles.formBase}>
          <div className={styles.formGroup}>
            <label>Tipo</label>
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="FACTURA_RECIBIDA">Factura Recibida</option>
              <option value="CHEQUE_EMITIDO">Cheque Emitido</option>
              <option value="EFECTIVO_EMITIDO">Efectivo Emitido</option>
              <option value="TRANSFERENCIA_EMITIDA">Transferencia Emitida</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Fecha (requerida)</label>
            <input type="date" name="fecha" value={form.fecha} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>Monto (requerido)</label>
            <input type="number" name="monto" value={form.monto} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>¿Con Factura?</label>
            <input
              type="checkbox"
              name="esConFactura"
              checked={form.esConFactura}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Descripción</label>
            <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>Sub-Índice Factura</label>
            <input
              type="text"
              name="subIndiceFactura"
              value={form.subIndiceFactura}
              onChange={handleChange}
            />
          </div>

          {esCheque && (
            <div style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
              <h3>Datos del Cheque</h3>
              <label>Número Cheque</label>
              <input
                type="text"
                name="numeroCheque"
                value={form.datosCheque.numeroCheque}
                onChange={handleDatosChequeChange}
              />
              <label>Banco</label>
              <input
                type="text"
                name="banco"
                value={form.datosCheque.banco}
                onChange={handleDatosChequeChange}
              />
              <label>Fecha Vencimiento</label>
              <input
                type="date"
                name="fechaVencimiento"
                value={form.datosCheque.fechaVencimiento}
                onChange={handleDatosChequeChange}
              />
              {form.tipo === "CHEQUE_EMITIDO" && (
                <>
                  <label>Endosado A</label>
                  <input
                    type="text"
                    name="endosadoA"
                    value={form.datosCheque.endosadoA}
                    onChange={handleDatosChequeChange}
                  />
                </>
              )}
            </div>
          )}

          {esTransferencia && (
            <div style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
              <h3>Datos de Transferencia</h3>
              <label>Número Comprobante</label>
              <input
                type="text"
                name="numeroComprobante"
                value={form.datosTransferencia.numeroComprobante}
                onChange={handleDatosTransferenciaChange}
              />
              <label>Banco Origen</label>
              <input
                type="text"
                name="bancoOrigen"
                value={form.datosTransferencia.bancoOrigen}
                onChange={handleDatosTransferenciaChange}
              />
              <label>Banco Destino</label>
              <input
                type="text"
                name="bancoDestino"
                value={form.datosTransferencia.bancoDestino}
                onChange={handleDatosTransferenciaChange}
              />
              <label>Fecha Acreditación</label>
              <input
                type="date"
                name="fechaAcreditacion"
                value={form.fechaAcreditacion}
                onChange={handleChange}
              />
            </div>
          )}

          <hr />
          <h3>Partidas por Obra</h3>
          {form.partidasObra.map((p, i) => (
            <div key={i} className={styles.partidasContainer}>
              <label>Obra</label>
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

          <div className={styles.actions}>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
