// src/pages/Contabilidad/Contabilidad.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, Outlet } from "react-router-dom";
import ModalBase from "../components/ModalBase.jsx";

// Ejemplo de estilos (puedes usar .module.css o lo que prefieras)
import styles from "../styles/pages/Contabilidad.module.css";

export default function Contabilidad() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Estados principales
  const [movimientos, setMovimientos] = useState([]);
  const [filtros, setFiltros] = useState({
    tipo: "",
    metodoPago: "",
    fechaDesde: "",
    fechaHasta: "",
    obra: "",
    proveedor: "",
    cliente: ""
  });

  // Combos de obras, proveedores, clientes
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
    fecha: new Date().toISOString().slice(0, 10),
    obra: "",
    proveedor: "",
    cliente: "",
    descripcion: "",
    // Cheque
    cheque: {
      numeroCheque: "",
      banco: "",
      fechaVencimiento: "",
      endosadoA: "",
      estadoCheque: "pendiente"
    },
    // Transferencia
    transferencia: {
      numeroComprobante: "",
      bancoOrigen: "",
      bancoDestino: ""
    },
    fechaAcreditacion: "" // para transferencias
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Cargar combos (obras, proveedores, clientes) y lista de movimientos
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
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener obras");
      const data = await res.json();
      setObras(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener proveedores");
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener clientes");
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 2. Listar movimientos con filtros
  const fetchMovimientos = async () => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      setLoading(true);

      const params = new URLSearchParams();
      if (filtros.tipo) params.append("tipo", filtros.tipo);
      if (filtros.metodoPago) params.append("metodoPago", filtros.metodoPago);
      if (filtros.fechaDesde) params.append("fechaDesde", filtros.fechaDesde);
      if (filtros.fechaHasta) params.append("fechaHasta", filtros.fechaHasta);
      if (filtros.obra) params.append("obra", filtros.obra);
      if (filtros.proveedor) params.append("proveedor", filtros.proveedor);
      if (filtros.cliente) params.append("cliente", filtros.cliente);

      const res = await fetch(`${API_URL}/api/contabilidad?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al listar movimientos");
      const data = await res.json();
      setMovimientos(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
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
      cheque: {
        numeroCheque: "",
        banco: "",
        fechaVencimiento: "",
        endosadoA: "",
        estadoCheque: "pendiente"
      },
      transferencia: {
        numeroComprobante: "",
        bancoOrigen: "",
        bancoDestino: ""
      },
      fechaAcreditacion: ""
    });
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
        numeroCheque: mov.cheque?.numeroCheque || "",
        banco: mov.cheque?.banco || "",
        fechaVencimiento: mov.cheque?.fechaVencimiento
          ? mov.cheque.fechaVencimiento.slice(0, 10)
          : "",
        endosadoA: mov.cheque?.endosadoA || "",
        estadoCheque: mov.cheque?.estadoCheque || "pendiente"
      },
      transferencia: {
        numeroComprobante: mov.transferencia?.numeroComprobante || "",
        bancoOrigen: mov.transferencia?.bancoOrigen || "",
        bancoDestino: mov.transferencia?.bancoDestino || ""
      },
      fechaAcreditacion: mov.fechaAcreditacion
        ? mov.fechaAcreditacion.slice(0, 10)
        : ""
    });
    setIsModalOpen(true);
  };

  // 5. Guardar (crear/editar)
  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.monto || formData.monto <= 0) {
      setErrorMsg("El monto debe ser mayor que 0");
      return;
    }
    if (!formData.fecha) {
      setErrorMsg("La fecha es obligatoria");
      return;
    }

    try {
      let url = `${API_URL}/api/contabilidad`;
      let method = "POST";
      if (editing) {
        url = `${API_URL}/api/contabilidad/${editing._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al guardar movimiento");
      }

      if (editing) {
        // Edit
        setMovimientos((prev) =>
          prev.map((m) => (m._id === data._id ? data : m))
        );
        setSuccessMsg("Movimiento actualizado correctamente.");
      } else {
        // Create
        setMovimientos([...movimientos, data]);
        setSuccessMsg("Movimiento creado correctamente.");
      }

      setIsModalOpen(false);
    } catch (error) {
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
        headers: { Authorization: `Bearer ${token}` }
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
      setErrorMsg(error.message);
    }
  };

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Subcampos (cheque, transferencia)
    if (name.startsWith("cheque.")) {
      const subcampo = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        cheque: { ...prev.cheque, [subcampo]: value }
      }));
    } else if (name.startsWith("transferencia.")) {
      const subcampo = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        transferencia: { ...prev.transferencia, [subcampo]: value }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Lógica para filtrar si es cheque/transfer
  const esCheque =
    formData.tipo === "CHEQUE_RECIBIDO" || formData.tipo === "CHEQUE_EMITIDO";
  const esTransferencia =
    formData.tipo === "TRANSFERENCIA_RECIBIDA" ||
    formData.tipo === "TRANSFERENCIA_EMITIDA";

  // Render principal
  return (
  <div className={styles.pageContainer}>
      <div className={styles.header}>
      <h1>Contabilidad</h1>

      {/* Ejemplo: link a la sub-ruta /contabilidad/nomina */}
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="nomina" style={{ marginRight: "1rem" }}>
          Ir a Nómina
        </Link>
      </nav>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <select
          name="tipo"
          value={filtros.tipo}
          onChange={handleFiltroChange}
        >
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

        {/* Obra */}
        <select
          name="obra"
          value={filtros.obra}
          onChange={handleFiltroChange}
        >
          <option value="">-- Obra (opcional) --</option>
          {obras.map((o) => (
            <option key={o._id} value={o._id}>
              {o.nombre} (#{o.codigoObra})
            </option>
          ))}
        </select>

        {/* Proveedor */}
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

        {/* Cliente */}
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

      <button onClick={handleOpenCreate} style={{ marginTop: "1rem" }}>
        + Nuevo Movimiento
      </button>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      {/* Listado */}
      {loading && <div style={{ margin: "2rem" }}>Cargando movimientos...</div>}

      {!loading && movimientos.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {movimientos.map((mov) => (
            <div
              key={mov._id}
              style={{
                border: "1px solid #ccc",
                marginBottom: "0.5rem",
                padding: "0.5rem"
              }}
            >
              <h3>
                {mov.tipo} - {mov.metodoPago} - ${mov.monto}
                {mov.factura === "con" ? " (c/F)" : " (s/F)"}
              </h3>
              <p>Fecha: {new Date(mov.fecha).toLocaleDateString()}</p>
              {mov.obra && (
                <p>
                  <strong>Obra:</strong> {mov.obra.nombre} (#{mov.obra.codigoObra})
                </p>
              )}
              {mov.proveedor && <p><strong>Proveedor:</strong> {mov.proveedor.nombre}</p>}
              {mov.cliente && (
                <p><strong>Cliente:</strong> {mov.cliente.nombre} {mov.cliente.apellido}</p>
              )}
              <p><strong>Descripción:</strong> {mov.descripcion}</p>

              {/* Detalles cheque/transferencia */}
              {mov.metodoPago === "cheque" && (
                <div style={{ marginLeft: "1rem", fontSize: "0.9rem" }}>
                  <p>Número Cheque: {mov.cheque?.numeroCheque}</p>
                  <p>Banco: {mov.cheque?.banco}</p>
                  <p>
                    F. Vencimiento:{" "}
                    {mov.cheque?.fechaVencimiento
                      ? new Date(mov.cheque.fechaVencimiento).toLocaleDateString()
                      : ""}
                  </p>
                  {mov.tipo === "CHEQUE_EMITIDO" && mov.cheque?.endosadoA && (
                    <p>Endosado a: {mov.cheque.endosadoA}</p>
                  )}
                </div>
              )}
              {mov.metodoPago === "transferencia" && (
                <div style={{ marginLeft: "1rem", fontSize: "0.9rem" }}>
                  <p>Número Comprobante: {mov.transferencia?.numeroComprobante}</p>
                  <p>Banco Origen: {mov.transferencia?.bancoOrigen}</p>
                  <p>Banco Destino: {mov.transferencia?.bancoDestino}</p>
                  <p>
                    F. Acreditación:{" "}
                    {mov.fechaAcreditacion
                      ? new Date(mov.fechaAcreditacion).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              )}

              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={() => handleOpenEdit(mov)}>Editar</button>
                <button onClick={() => handleDelete(mov._id)} style={{ marginLeft: "0.5rem", backgroundColor: "#dc3545", color: "#fff" }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && movimientos.length === 0 && !errorMsg && (
        <div style={{ marginTop: "1rem" }}>No hay movimientos</div>
      )}

      {/* Modal Crear/Editar */}
      {isModalOpen && (
        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editing ? "Editar Movimiento" : "Nuevo Movimiento"}
        >
          <form onSubmit={handleSave}>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="PAGO_RECIBIDO">PAGO_RECIBIDO</option>
                <option value="PAGO_EMITIDO">PAGO_EMITIDO</option>
                <option value="FACTURA_EMITIDA">FACTURA_EMITIDA</option>
                <option value="FACTURA_RECIBIDA">FACTURA_RECIBIDA</option>
                <option value="CHEQUE_EMITIDO">CHEQUE_EMITIDO</option>
                <option value="CHEQUE_RECIBIDO">CHEQUE_RECIBIDO</option>
                <option value="EFECTIVO_EMITIDO">EFECTIVO_EMITIDO</option>
                <option value="EFECTIVO_RECIBIDO">EFECTIVO_RECIBIDO</option>
                <option value="TRANSFERENCIA_EMITIDA">TRANSFERENCIA_EMITIDA</option>
                <option value="TRANSFERENCIA_RECIBIDA">TRANSFERENCIA_RECIBIDA</option>
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
              <select
                name="factura"
                value={formData.factura}
                onChange={handleChange}
              >
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
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>

            {/* Obra */}
            <div className="form-group">
              <label>Obra (opcional)</label>
              <select
                name="obra"
                value={formData.obra}
                onChange={handleChange}
              >
                <option value="">-- General --</option>
                {obras.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.nombre} (#{o.codigoObra})
                  </option>
                ))}
              </select>
            </div>

            {/* Si es PAGO_EMITIDO => Proveedor, si es PAGO_RECIBIDO => Cliente, etc. */}
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

            {/* Datos Cheque (solo si esCheque) */}
            {esCheque && (
              <div style={{ marginLeft: "1rem", border: "1px solid #ccc", padding: "0.5rem", marginBottom: "1rem" }}>
                <h4>Datos del Cheque</h4>
                <label>Número Cheque</label>
                <input
                  type="text"
                  name="cheque.numeroCheque"
                  value={formData.cheque.numeroCheque}
                  onChange={handleChange}
                />
                <label>Banco</label>
                <input
                  type="text"
                  name="cheque.banco"
                  value={formData.cheque.banco}
                  onChange={handleChange}
                />
                <label>Fecha Vencimiento</label>
                <input
                  type="date"
                  name="cheque.fechaVencimiento"
                  value={formData.cheque.fechaVencimiento}
                  onChange={handleChange}
                />
                {formData.tipo === "CHEQUE_EMITIDO" && (
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

            {/* Datos Transferencia (solo si esTransferencia) */}
            {esTransferencia && (
              <div style={{ marginLeft: "1rem", border: "1px solid #ccc", padding: "0.5rem", marginBottom: "1rem" }}>
                <h4>Datos de Transferencia</h4>
                <label>Número Comprobante</label>
                <input
                  type="text"
                  name="transferencia.numeroComprobante"
                  value={formData.transferencia.numeroComprobante}
                  onChange={handleChange}
                />
                <label>Banco Origen</label>
                <input
                  type="text"
                  name="transferencia.bancoOrigen"
                  value={formData.transferencia.bancoOrigen}
                  onChange={handleChange}
                />
                <label>Banco Destino</label>
                <input
                  type="text"
                  name="transferencia.bancoDestino"
                  value={formData.transferencia.bancoDestino}
                  onChange={handleChange}
                />
                <label>Fecha Acreditación</label>
                <input
                  type="date"
                  name="fechaAcreditacion"
                  value={formData.fechaAcreditacion}
                  onChange={handleChange}
                />
              </div>
            )}

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </ModalBase>
      )}

      {/* Aquí se renderiza la sub-ruta (Nómina) */}
      <Outlet />
      </div></div>
  );
}
