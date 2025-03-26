import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import ModalNuevoCliente from "./ModalNuevoCliente.jsx";
import ModalImportarPerfilesOV from "./ModalImportarPerfilesOV.jsx";
import ModalImportarVidriosOV from "./ModalImportarVidriosOV.jsx";
import ModalImportarAccesoriosOV from "./ModalImportarAccesoriosOV.jsx";
import ModalImportarTipologiasOV from "./ModalImportarTipologiasOV.jsx";

export default function ModalObra({ obra, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const isEdit = !!obra && !!obra._id;

  const [clientes, setClientes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);

  const [modalPerfilesOpen, setModalPerfilesOpen] = useState(false);
  const [modalVidriosOpen, setModalVidriosOpen] = useState(false);
  const [modalAccesoriosOpen, setModalAccesoriosOpen] = useState(false);
  const [modalTipologiasOpen, setModalTipologiasOpen] = useState(false);

  const [form, setForm] = useState({
    codigoObra: "",
    nombre: "",
    cliente: "",
    direccion: "",
    contacto: "",
    mapa: "",
    fechaEntrega: "",
    importeConFactura: 0,
    importeSinFactura: 0,
    importeTotal: 0,
    indiceActualizacionSaldo: 0,
    fechaInicioCortePerfiles: "",
    fechaInicioArmado: "",
    fechaEnvidriado: "",
    fechaInicioMontaje: "",
    fechaMedicion: "",
    ordenProduccionAprobada: false,
    finalObra: false,
    estadoGeneral: "Presupuestada",
    estado: {
      perfiles: "pendiente",
      vidrios: "pendiente",
      accesorios: "pendiente",
      produccion: "pendiente",
      medicion: "pendiente",
      aprobada: "pendiente"
    },
    saldo: "Con saldo a cobrar",
    observaciones: ""
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (obra) {
      setForm({
        ...form,
        ...obra,
        cliente: obra.cliente?._id || obra.cliente || "",
        fechaEntrega: obra.fechaEntrega?.slice(0, 10) || "",
        fechaInicioCortePerfiles: obra.fechaInicioCortePerfiles?.slice(0, 10) || "",
        fechaInicioArmado: obra.fechaInicioArmado?.slice(0, 10) || "",
        fechaEnvidriado: obra.fechaEnvidriado?.slice(0, 10) || "",
        fechaInicioMontaje: obra.fechaInicioMontaje?.slice(0, 10) || "",
        fechaMedicion: obra.fechaMedicion?.slice(0, 10) || ""
      });
    }
  }, [obra]);

  useEffect(() => {
    const cf = parseFloat(form.importeConFactura) || 0;
    const sf = parseFloat(form.importeSinFactura) || 0;
    setForm((prev) => ({
      ...prev,
      importeTotal: cf + sf
    }));
  }, [form.importeConFactura, form.importeSinFactura]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("estado.")) {
      const campo = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        estado: { ...prev.estado, [campo]: value }
      }));
      return;
    }

    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.nombre || !form.direccion || !form.contacto) {
      setErrorMsg("Los campos Nombre, Dirección y Contacto son obligatorios.");
      return;
    }

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${API_URL}/api/obras/${obra._id}`
        : `${API_URL}/api/obras`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Error al guardar la obra");

      onSaved?.();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <ModalBase isOpen={true} onClose={onClose} title={isEdit ? "Editar Obra" : "Nueva Obra"}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} required />

          <label>Cliente</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select name="cliente" value={form.cliente} onChange={handleChange} required>
              <option value="">Seleccionar cliente</option>
              {clientes.map(c => (
                <option key={c._id} value={c._id}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setIsClienteModalOpen(true)}>➕</button>
          </div>

          <label>Dirección</label>
          <input name="direccion" value={form.direccion} onChange={handleChange} required />

          <label>Contacto</label>
          <input name="contacto" value={form.contacto} onChange={handleChange} required />

          <label>Fecha de Entrega</label>
          <input type="date" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} />

          <label>Importes</label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input type="number" name="importeConFactura" placeholder="Con factura" value={form.importeConFactura} onChange={handleChange} />
            <input type="number" name="importeSinFactura" placeholder="Sin factura" value={form.importeSinFactura} onChange={handleChange} />
            <input type="number" value={form.importeTotal} readOnly />
          </div>

          {/* Botones para importar materiales OV */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button type="button" onClick={() => setModalPerfilesOpen(true)}>📦 Perfiles OV</button>
            <button type="button" onClick={() => setModalVidriosOpen(true)}>🪟 Vidrios OV</button>
            <button type="button" onClick={() => setModalAccesoriosOpen(true)}>🔩 Accesorios OV</button>
            <button type="button" onClick={() => setModalTipologiasOpen(true)}>🧱 Tipologías OV</button>
          </div>

          <label>Observaciones</label>
          <textarea name="observaciones" value={form.observaciones} onChange={handleChange} />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="submit">{isEdit ? "Actualizar" : "Guardar"}</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </ModalBase>

      {/* Modales para materiales OV */}
      {modalPerfilesOpen && (
        <ModalImportarPerfilesOV obra={obra} onClose={() => setModalPerfilesOpen(false)} />
      )}
      {modalVidriosOpen && (
        <ModalImportarVidriosOV obra={obra} onClose={() => setModalVidriosOpen(false)} />
      )}
      {modalAccesoriosOpen && (
        <ModalImportarAccesoriosOV obra={obra} onClose={() => setModalAccesoriosOpen(false)} />
      )}
      {modalTipologiasOpen && (
        <ModalImportarTipologiasOV obra={obra} onClose={() => setModalTipologiasOpen(false)} />
      )}

      {/* Modal para crear nuevo cliente */}
      {isClienteModalOpen && (
        <ModalNuevoCliente
          onCreated={() => {
            setIsClienteModalOpen(false);
            fetchClientes();
          }}
          onClose={() => setIsClienteModalOpen(false)}
        />
      )}
    </>
  );
}
