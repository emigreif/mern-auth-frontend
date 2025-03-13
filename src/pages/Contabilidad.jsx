// src/pages/Contabilidad.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "../components/ModalBase.jsx";

export default function Contabilidad() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [movimientos, setMovimientos] = useState([]);
  const [filtros, setFiltros] = useState({
    tipo: "",
    metodoPago: "",
    fechaDesde: "",
    fechaHasta: "",
    obra: "",
    proveedor: "",
    cliente: "",
  });

  // Para cargar combos de obras, proveedores, clientes
  const [obras, setObras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Modal para crear/editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null => crear

  // Form movimiento
  const [formData, setFormData] = useState({
    tipo: "PAGO_RECIBIDO",  // default
    metodoPago: "efectivo",
    factura: "sin",
    monto: 0,
    fecha: new Date().toISOString().slice(0, 10), // hoy
    obra: "",
    proveedor: "",
    cliente: "",
    descripcion: "",
    cheque: {
      numero: "",
      banco: "",
      fechaAcreditacion: "",
      endosadoA: "",
    },
    transferencia: {
      nroOperacion: "",
      fechaAcreditacion: "",
    },
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 1. Cargar combos (obras, proveedores, clientes)
  useEffect(() => {
    if (token) {
      fetchObras();
      fetchProveedores();
      fetchClientes();
      fetchMovimientos();
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
      console.error(error);
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
      console.error(error);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 2. Cargar movimientos (listado)
  const fetchMovimientos = async () => {
    try {
      const params = new URLSearchParams();
      if (filtros.tipo) params.append("tipo", filtros.tipo);
      if (filtros.metodoPago) params.append("metodoPago", filtros.metodoPago);
      if (filtros.fechaDesde) params.append("fechaDesde", filtros.fechaDesde);
      if (filtros.fechaHasta) params.append("fechaHasta", filtros.fechaHasta);
      if (filtros.obra) params.append("obra", filtros.obra);
      if (filtros.proveedor) params.append("proveedor", filtros.proveedor);
      if (filtros.cliente) params.append("cliente", filtros.cliente);

      const res = await fetch(`${API_URL}/api/contabilidad?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al listar movimientos");
      const data = await res.json();
      setMovimientos(data);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  // Manejo de filtros
  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = () => {
    fetchMovimientos();
  };

  // 3. Abrir modal (crear)
  const handleOpenCreate = () => {
    setEditing(null);
    setFormData({
      tipo: "PAGO_RECIBIDO",
      metodoPago: "efectivo",
      factura: "sin",
      monto: 0,
      fecha: new Date().toISOString().slice(0, 10),
      obra: "",
      proveedor: "",
      cliente: "",
      descripcion: "",
      cheque: { numero: "", banco: "", fechaAcreditacion: "", endosadoA: "" },
      transferencia: { nroOperacion: "", fechaAcreditacion: "" },
    });
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  // 4. Abrir modal (editar)
  const handleOpenEdit = (mov) => {
    setEditing(mov);
    setErrorMsg("");
    setSuccessMsg("");

    setFormData({
      tipo: mov.tipo,
      metodoPago: mov.metodoPago,
      factura: mov.factura || "sin",
      monto: mov.monto,
      fecha: mov.fecha ? mov.fecha.slice(0, 10) : new Date().toISOString().slice(0, 10),
      obra: mov.obra?._id || "",
      proveedor: mov.proveedor?._id || "",
      cliente: mov.cliente?._id || "",
      descripcion: mov.descripcion || "",
      cheque: {
        numero: mov.cheque?.numero || "",
        banco: mov.cheque?.banco || "",
        fechaAcreditacion: mov.cheque?.fechaAcreditacion
          ? mov.cheque.fechaAcreditacion.slice(0, 10)
          : "",
        endosadoA: mov.cheque?.endosadoA || "",
      },
      transferencia: {
        nroOperacion: mov.transferencia?.nroOperacion || "",
        fechaAcreditacion: mov.transferencia?.fechaAcreditacion
          ? mov.transferencia.fechaAcreditacion.slice(0, 10)
          : "",
      },
    });
    setIsModalOpen(true);
  };

  // 5. Guardar (crear/editar)
  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validaciones mínimas
    if (!formData.monto || formData.monto <= 0) {
      setErrorMsg("El monto debe ser mayor que 0");
      return;
    }
    if (!formData.fecha) {
      setErrorMsg("La fecha es obligatoria");
      return;
    }

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `${API_URL}/api/contabilidad/${editing._id}`
        : `${API_URL}/api/contabilidad`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (err) {
          errorData = { message: "Error desconocido en el servidor" };
        }
        throw new Error(errorData.message || "Error al guardar movimiento");
      }

      const data = await res.json();
      if (editing) {
        setMovimientos(movimientos.map((m) => (m._id === data._id ? data : m)));
        setSuccessMsg("Movimiento actualizado correctamente.");
      } else {
        setMovimientos([...movimientos, data]);
        setSuccessMsg("Movimiento creado correctamente.");
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  // 6. Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este movimiento?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_URL}/api/contabilidad/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (err) {
          errorData = { message: "Error desconocido en el servidor" };
        }
        throw new Error(errorData.message || "Error al eliminar movimiento");
      }
      setMovimientos(movimientos.filter((m) => m._id !== id));
      setSuccessMsg("Movimiento eliminado.");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si es subcampo de cheque / transferencia
    if (name.startsWith("cheque.")) {
      const subcampo = name.split(".")[1]; // "numero", "banco", etc.
      setFormData((prev) => ({
        ...prev,
        cheque: { ...prev.cheque, [subcampo]: value },
      }));
    } else if (name.startsWith("transferencia.")) {
      const subcampo = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        transferencia: { ...prev.transferencia, [subcampo]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Render
  return (
    <div className="page-contenedor">
      <h1>Contabilidad</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      {/* Filtros */}
      <div className="filtros">
        <select name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
          <option value="">-- Tipo --</option>
          <option value="PAGO_RECIBIDO">PAGO_RECIBIDO</option>
          <option value="PAGO_EMITIDO">PAGO_EMITIDO</option>
          <option value="FACTURA_EMITIDA">FACTURA_EMITIDA</option>
          <option value="FACTURA_RECIBIDA">FACTURA_RECIBIDA</option>
        </select>

        <select
          name="metodoPago"
          value={filtros.metodoPago}
          onChange={handleFiltroChange}
        >
          <option value="">-- Método --</option>
          <option value="efectivo">efectivo</option>
          <option value="cheque">cheque</option>
          <option value="transferencia">transferencia</option>
          <option value="otro">otro</option>
        </select>

        <input
          type="date"
          name="fechaDesde"
          value={filtros.fechaDesde}
          onChange={handleFiltroChange}
          placeholder="Fecha Desde"
        />
        <input
          type="date"
          name="fechaHasta"
          value={filtros.fechaHasta}
          onChange={handleFiltroChange}
          placeholder="Fecha Hasta"
        />

        <select name="obra" value={filtros.obra} onChange={handleFiltroChange}>
          <option value="">-- Obra (opcional) --</option>
          {obras.map((o) => (
            <option key={o._id} value={o._id}>
              {o.nombre} (#{o.codigoObra})
            </option>
          ))}
        </select>

        <select
          name="proveedor"
          value={filtros.proveedor}
          onChange={handleFiltroChange}
        >
          <option value="">-- Proveedor (opcional) --</option>
          {proveedores.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nombre}
            </option>
          ))}
        </select>

        <select
          name="cliente"
          value={filtros.cliente}
          onChange={handleFiltroChange}
        >
          <option value="">-- Cliente (opcional) --</option>
          {clientes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        <button onClick={handleBuscar}>Buscar</button>
      </div>

      <button onClick={handleOpenCreate}>+ Nuevo Movimiento</button>

      {/* Listado */}
      <div className="movimientos-list">
        {movimientos.map((mov) => (
          <div key={mov._id} className="mov-card">
            <h3>
              {mov.tipo} - {mov.metodoPago} - {mov.monto} 
              {mov.factura === "con" ? " (c/F)" : " (s/F)"}
            </h3>
            <p>Fecha: {new Date(mov.fecha).toLocaleDateString()}</p>
            {mov.obra && <p>Obra: {mov.obra.nombre} (#{mov.obra.codigoObra})</p>}
            {mov.proveedor && <p>Proveedor: {mov.proveedor.nombre}</p>}
            {mov.cliente && (
              <p>
                Cliente: {mov.cliente.nombre} {mov.cliente.apellido}
              </p>
            )}
            <p>Descripción: {mov.descripcion}</p>

            {/* Si es cheque, mostrar detalles */}
            {mov.metodoPago === "cheque" && (
              <div style={{ marginLeft: "1rem", fontSize: "0.9rem" }}>
                <p>Número Cheque: {mov.cheque?.numero}</p>
                <p>Banco: {mov.cheque?.banco}</p>
                <p>
                  F. Acreditación:{" "}
                  {mov.cheque?.fechaAcreditacion
                    ? new Date(mov.cheque.fechaAcreditacion).toLocaleDateString()
                    : ""}
                </p>
                {mov.tipo === "PAGO_EMITIDO" && mov.cheque?.endosadoA && (
                  <p>Endosado a: {mov.cheque.endosadoA}</p>
                )}
              </div>
            )}

            {/* Si es transferencia, mostrar detalles */}
            {mov.metodoPago === "transferencia" && (
              <div style={{ marginLeft: "1rem", fontSize: "0.9rem" }}>
                <p>Operación: {mov.transferencia?.nroOperacion}</p>
                <p>
                  F. Acreditación:{" "}
                  {mov.transferencia?.fechaAcreditacion
                    ? new Date(mov.transferencia.fechaAcreditacion).toLocaleDateString()
                    : ""}
                </p>
              </div>
            )}

            <div className="actions">
              <button onClick={() => handleOpenEdit(mov)}>Editar</button>
              <button onClick={() => handleDelete(mov._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear/Editar */}
      <ModalBase
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Editar Movimiento" : "Nuevo Movimiento"}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Tipo</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="PAGO_RECIBIDO">PAGO_RECIBIDO</option>
              <option value="PAGO_EMITIDO">PAGO_EMITIDO</option>
              <option value="FACTURA_EMITIDA">FACTURA_EMITIDA</option>
              <option value="FACTURA_RECIBIDA">FACTURA_RECIBIDA</option>
            </select>
          </div>

          <div className="form-group">
            <label>Método de Pago</label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
            >
              <option value="efectivo">efectivo</option>
              <option value="cheque">cheque</option>
              <option value="transferencia">transferencia</option>
              <option value="otro">otro</option>
            </select>
          </div>

          <div className="form-group">
            <label>¿Con o Sin Factura?</label>
            <select name="factura" value={formData.factura} onChange={handleChange}>
              <option value="sin">Sin</option>
              <option value="con">Con</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monto</label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
            />
          </div>

          {/* Obra */}
          <div className="form-group">
            <label>Obra (opcional)</label>
            <select name="obra" value={formData.obra} onChange={handleChange}>
              <option value="">-- General --</option>
              {obras.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.nombre} (#{o.codigoObra})
                </option>
              ))}
            </select>
          </div>

          {/* Si es PAGO_EMITIDO => Proveedor, si es PAGO_RECIBIDO => Cliente */}
          {formData.tipo === "PAGO_EMITIDO" && (
            <div className="form-group">
              <label>Proveedor</label>
              <select
                name="proveedor"
                value={formData.proveedor}
                onChange={handleChange}
              >
                <option value="">-- Ninguno --</option>
                {proveedores.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.tipo === "PAGO_RECIBIDO" && (
            <div className="form-group">
              <label>Cliente</label>
              <select
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
              >
                <option value="">-- Ninguno --</option>
                {clientes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>

          {/* Datos Cheque (solo si metodoPago === 'cheque') */}
          {formData.metodoPago === "cheque" && (
            <div style={{ marginLeft: "1rem" }}>
              <h4>Datos del Cheque</h4>
              <label>Número</label>
              <input
                type="text"
                name="cheque.numero"
                value={formData.cheque.numero}
                onChange={handleChange}
              />
              <label>Banco</label>
              <input
                type="text"
                name="cheque.banco"
                value={formData.cheque.banco}
                onChange={handleChange}
              />
              <label>Fecha Acreditación</label>
              <input
                type="date"
                name="cheque.fechaAcreditacion"
                value={formData.cheque.fechaAcreditacion}
                onChange={handleChange}
              />
              {/* Solo si es PAGO_EMITIDO */}
              {formData.tipo === "PAGO_EMITIDO" && (
                <>
                  <label>Endosado a</label>
                  <input
                    type="text"
                    name="cheque.endosadoA"
                    value={formData.cheque.endosadoA}
                    onChange={handleChange}
                  />
                </>
              )}
            </div>
          )}

          {/* Datos Transferencia */}
          {formData.metodoPago === "transferencia" && (
            <div style={{ marginLeft: "1rem" }}>
              <h4>Datos de Transferencia</h4>
              <label>Nro Operación</label>
              <input
                type="text"
                name="transferencia.nroOperacion"
                value={formData.transferencia.nroOperacion}
                onChange={handleChange}
              />
              <label>Fecha Acreditación</label>
              <input
                type="date"
                name="transferencia.fechaAcreditacion"
                value={formData.transferencia.fechaAcreditacion}
                onChange={handleChange}
              />
            </div>
          )}

          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

          <div className="form-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>
    </div>
  );
}
