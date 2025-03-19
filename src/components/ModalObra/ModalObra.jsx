// src/components/ModalObra/ModalObra.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "../ModalBase/ModalBase.jsx";
import NuevoCliente from "../NuevoCliente/NuevoCliente.jsx"; // ✅ Importamos el modal de Nuevo Cliente

export default function ModalObra({ obra, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const isEdit = !!obra && !!obra._id;  // 🔹 Ahora solo es edición si tiene un ID


  // Lista de clientes (si deseas un select)
  const [clientes, setClientes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false); // ✅ Estado para abrir el modal de cliente


  // Form con TODOS los campos de tu modelo
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

    // Arrays
    perfilesPresupuesto: [],
    vidriosPresupuesto: [],
    accesoriosPresupuesto: [],

    // Fechas (pueden ser auto, aquí las mostramos)
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

  // 1. Cargar clientes (si deseas un select de clientes)
  useEffect(() => {
    fetchClientes();
  }, []);

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

  // 2. Al montar/cambiar "obra", llenamos form
  useEffect(() => {
    if (obra) {
      setForm({
        codigoObra: obra.codigoObra || "",
        nombre: obra.nombre || "",
        cliente: obra.cliente?._id || "",
        direccion: obra.direccion || "",
        contacto: obra.contacto || "",
        mapa: obra.mapa || "",
        fechaEntrega: obra.fechaEntrega ? obra.fechaEntrega.slice(0, 10) : "",
        importeConFactura: obra.importeConFactura || 0,
        importeSinFactura: obra.importeSinFactura || 0,
        importeTotal: obra.importeTotal || 0,
        indiceActualizacionSaldo: obra.indiceActualizacionSaldo || 0,

        perfilesPresupuesto: obra.perfilesPresupuesto || [],
        vidriosPresupuesto: obra.vidriosPresupuesto || [],
        accesoriosPresupuesto: obra.accesoriosPresupuesto || [],

        fechaInicioCortePerfiles: obra.fechaInicioCortePerfiles
          ? obra.fechaInicioCortePerfiles.slice(0, 10)
          : "",
        fechaInicioArmado: obra.fechaInicioArmado
          ? obra.fechaInicioArmado.slice(0, 10)
          : "",
        fechaEnvidriado: obra.fechaEnvidriado
          ? obra.fechaEnvidriado.slice(0, 10)
          : "",
        fechaInicioMontaje: obra.fechaInicioMontaje
          ? obra.fechaInicioMontaje.slice(0, 10)
          : "",
        fechaMedicion: obra.fechaMedicion
          ? obra.fechaMedicion.slice(0, 10)
          : "",

        ordenProduccionAprobada: obra.ordenProduccionAprobada || false,
        finalObra: obra.finalObra || false,
        estadoGeneral: obra.estadoGeneral || "Presupuestada",
        estado: obra.estado || {
          perfiles: "pendiente",
          vidrios: "pendiente",
          accesorios: "pendiente",
          produccion: "pendiente",
          medicion: "pendiente",
          aprobada: "pendiente"
        },
        saldo: obra.saldo || "Con saldo a cobrar",
        observaciones: obra.observaciones || ""
      });
    } else {
      // Nuevo => limpias
      setForm((prev) => ({
        ...prev,
        codigoObra: "", 
        estado: {
          perfiles: "pendiente",
          vidrios: "pendiente",
          accesorios: "pendiente",
          produccion: "pendiente",
          medicion: "pendiente",
          aprobada: "pendiente"
        }
      }));
    }
  }, [obra]);

  // 3. Recalcular importeTotal
  useEffect(() => {
    const cf = parseFloat(form.importeConFactura) || 0;
    const sf = parseFloat(form.importeSinFactura) || 0;
    setForm((prev) => ({
      ...prev,
      importeTotal: cf + sf
    }));
  }, [form.importeConFactura, form.importeSinFactura]);

  // Manejo inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Manejo de subcampos => estado.*
    if (name.startsWith("estado.")) {
      const campo = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        estado: { ...prev.estado, [campo]: value }
      }));
      return;
    }

    // Checkbox
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  // 4. Sub-form para Perfiles
  const handleAddPerfil = () => {
    setForm((prev) => ({
      ...prev,
      perfilesPresupuesto: [
        ...prev.perfilesPresupuesto,
        { codigo: "", descripcion: "", cantidad: 0, precio: 0 }
      ]
    }));
  };
  const handleRemovePerfil = (index) => {
    const arr = [...form.perfilesPresupuesto];
    arr.splice(index, 1);
    setForm({ ...form, perfilesPresupuesto: arr });
  };
  const handlePerfilChange = (index, field, val) => {
    const arr = [...form.perfilesPresupuesto];
    arr[index] = { ...arr[index], [field]: val };
    setForm({ ...form, perfilesPresupuesto: arr });
  };

  // 5. Sub-form para Vidrios
  const handleAddVidrio = () => {
    setForm((prev) => ({
      ...prev,
      vidriosPresupuesto: [
        ...prev.vidriosPresupuesto,
        { codigo: "", descripcion: "", cantidad: 0, precio: 0 }
      ]
    }));
  };
  const handleRemoveVidrio = (index) => {
    const arr = [...form.vidriosPresupuesto];
    arr.splice(index, 1);
    setForm({ ...form, vidriosPresupuesto: arr });
  };
  const handleVidrioChange = (index, field, val) => {
    const arr = [...form.vidriosPresupuesto];
    arr[index] = { ...arr[index], [field]: val };
    setForm({ ...form, vidriosPresupuesto: arr });
  };

  // 6. Sub-form para Accesorios
  const handleAddAccesorio = () => {
    setForm((prev) => ({
      ...prev,
      accesoriosPresupuesto: [
        ...prev.accesoriosPresupuesto,
        { codigo: "", descripcion: "", cantidad: 0, precio: 0 }
      ]
    }));
  };
  const handleRemoveAccesorio = (index) => {
    const arr = [...form.accesoriosPresupuesto];
    arr.splice(index, 1);
    setForm({ ...form, accesoriosPresupuesto: arr });
  };
  const handleAccesorioChange = (index, field, val) => {
    const arr = [...form.accesoriosPresupuesto];
    arr[index] = { ...arr[index], [field]: val };
    setForm({ ...form, accesoriosPresupuesto: arr });
  };

  // Guardar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.nombre.trim()) {
      setErrorMsg("El campo 'Nombre' es obligatorio.");
      return;
    }
    if (!form.direccion.trim()) {
      setErrorMsg("El campo 'Dirección' es obligatorio.");
      return;
    }
    if (!form.contacto.trim()) {
      setErrorMsg("El campo 'Contacto' es obligatorio.");
      return;
    }

    try {
      let url = `${API_URL}/api/obras`;
      let method = "POST";
      if (isEdit) {
        url = `${API_URL}/api/obras/${obra._id}`;
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
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al guardar obra");
      }
      await res.json();
      if (onSaved) onSaved(true);
      onClose(false);
    } catch (error) {
      setErrorMsg(error.message);
    }

  };
  const handleClienteCreado = async () => {
    setIsClienteModalOpen(false);
    await fetchClientes();
  };
   return (
    <>
      <ModalBase isOpen={true} onClose={onClose} title={isEdit ? "Editar Obra" : "Nueva Obra"}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          <div>
            <label>Código de Obra</label>
            <input type="text" name="codigoObra" value={form.codigoObra} disabled />
          </div>

          {/* Cliente + Botón Nuevo Cliente */}
          <div>
            <label>Cliente</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select name="cliente" value={form.cliente} onChange={handleChange} required>
                <option value="">-- Seleccionar Cliente --</option>
                {clientes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => setIsClienteModalOpen(true)}>➕ Nuevo Cliente</button>
            </div>
          </div>

          <div>
            <label>Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
        <div>
          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contacto</label>
          <input
            type="text"
            name="contacto"
            value={form.contacto}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mapa (URL)</label>
          <input
            type="text"
            name="mapa"
            value={form.mapa}
            onChange={handleChange}
          />
        </div>

        {/* Fecha entrega */}
        <div>
          <label>Fecha Entrega</label>
          <input
            type="date"
            name="fechaEntrega"
            value={form.fechaEntrega}
            onChange={handleChange}
          />
        </div>

        {/* Importe c/F, s/F, total (read-only) */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <label>Importe c/F</label>
            <input
              type="number"
              name="importeConFactura"
              value={form.importeConFactura}
              onChange={handleChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Importe s/F</label>
            <input
              type="number"
              name="importeSinFactura"
              value={form.importeSinFactura}
              onChange={handleChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Total</label>
            <input type="number" value={form.importeTotal} readOnly />
          </div>
        </div>

        {/* Índice */}
        <div>
          <label>Índice Actualización Saldo</label>
          <input
            type="number"
            name="indiceActualizacionSaldo"
            value={form.indiceActualizacionSaldo}
            onChange={handleChange}
          />
        </div>

        {/* Sub-form Perfiles */}
        <div style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
          <h4>Perfiles Presupuesto</h4>
          {form.perfilesPresupuesto.map((item, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                marginBottom: "0.5rem",
                padding: "0.5rem"
              }}
            >
              <label>Código</label>
              <input
                type="text"
                value={item.codigo}
                onChange={(e) =>
                  handlePerfilChange(idx, "codigo", e.target.value)
                }
              />
              <label>Descripción</label>
              <input
                type="text"
                value={item.descripcion}
                onChange={(e) =>
                  handlePerfilChange(idx, "descripcion", e.target.value)
                }
              />
              <label>Cantidad</label>
              <input
                type="number"
                value={item.cantidad}
                onChange={(e) =>
                  handlePerfilChange(
                    idx,
                    "cantidad",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
              <label>Precio</label>
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handlePerfilChange(
                    idx,
                    "price",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
              <button
                type="button"
                onClick={() => handleRemovePerfil(idx)}
                style={{ marginLeft: "0.5rem" }}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddPerfil}>
            + Agregar Perfil
          </button>
        </div>

        {/* Sub-form Vidrios */}
        <div style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
          <h4>Vidrios Presupuesto</h4>
          {form.vidriosPresupuesto.map((item, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                marginBottom: "0.5rem",
                padding: "0.5rem"
              }}
            >
              <label>Código</label>
              <input
                type="text"
                value={item.codigo}
                onChange={(e) =>
                  handleVidrioChange(idx, "codigo", e.target.value)
                }
              />
              <label>Descripción</label>
              <input
                type="text"
                value={item.descripcion}
                onChange={(e) =>
                  handleVidrioChange(idx, "descripcion", e.target.value)
                }
              />
              <label>Cantidad</label>
              <input
                type="number"
                value={item.cantidad}
                onChange={(e) =>
                  handleVidrioChange(
                    idx,
                    "cantidad",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
              <label>Precio</label>
              <input
                type="number"
                value={item.precio}
                onChange={(e) =>
                  handleVidrioChange(
                    idx,
                    "precio",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
              <button
                type="button"
                onClick={() => handleRemoveVidrio(idx)}
                style={{ marginLeft: "0.5rem" }}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddVidrio}>
            + Agregar Vidrio
          </button>
        </div>

        {/* Sub-form Accesorios */}
        <div style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
          <h4>Accesorios Presupuesto</h4>
          {form.accesoriosPresupuesto.map((item, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                marginBottom: "0.5rem",
                padding: "0.5rem"
              }}
            >
              <label>Código</label>
              <input
                type="text"
                value={item.codigo}
                onChange={(e) =>
                  handleAccesorioChange(idx, "codigo", e.target.value)
                }
              />
              <label>Descripción</label>
              <input
                type="text"
                value={item.descripcion}
                onChange={(e) =>
                  handleAccesorioChange(idx, "descripcion", e.target.value)
                }
              />
              <label>Cantidad</label>
              <input
                type="number"
                value={item.cantidad}
                onChange={(e) =>
                  handleAccesorioChange(
                    idx,
                    "cantidad",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
              <label>Precio</label>
              <input
                type="number"
                value={item.precio}
                onChange={(e) =>
                  handleAccesorioChange(
                    idx,
                    "precio",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
              <button
                type="button"
                onClick={() => handleRemoveAccesorio(idx)}
                style={{ marginLeft: "0.5rem" }}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddAccesorio}>
            + Agregar Accesorio
          </button>
        </div>

        {/* Fechas auto => readOnly */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <div>
            <label>Fecha Inicio Corte</label>
            <input
              type="date"
              name="fechaInicioCortePerfiles"
              value={form.fechaInicioCortePerfiles}
              readOnly
            />
          </div>
          <div>
            <label>Fecha Inicio Armado</label>
            <input
              type="date"
              name="fechaInicioArmado"
              value={form.fechaInicioArmado}
              readOnly
            />
          </div>
          <div>
            <label>Fecha Envidriado</label>
            <input
              type="date"
              name="fechaEnvidriado"
              value={form.fechaEnvidriado}
              readOnly
            />
          </div>
          <div>
            <label>Fecha Inicio Montaje</label>
            <input
              type="date"
              name="fechaInicioMontaje"
              value={form.fechaInicioMontaje}
              readOnly
            />
          </div>
          <div>
            <label>Fecha Medición</label>
            <input
              type="date"
              name="fechaMedicion"
              value={form.fechaMedicion}
              readOnly
            />
          </div>
        </div>

        {/* Checkbox */}
        <div>
          <label>
            <input
              type="checkbox"
              name="ordenProduccionAprobada"
              checked={form.ordenProduccionAprobada}
              onChange={handleChange}
            />
            Orden Producción Aprobada
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="finalObra"
              checked={form.finalObra}
              onChange={handleChange}
            />
            Final de Obra
          </label>
        </div>

        {/* estadoGeneral */}
        <div>
          <label>Estado General</label>
          <select
            name="estadoGeneral"
            value={form.estadoGeneral}
            onChange={handleChange}
          >
            <option value="Presupuestada">Presupuestada</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Finalizada">Finalizada</option>
          </select>
        </div>

        {/* estado detallado */}
        <div style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
          <h4>Estado Detallado</h4>
          <div>
            <label>Perfiles</label>
            <select
              name="estado.perfiles"
              value={form.estado.perfiles}
              onChange={handleChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">próximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
          <div>
            <label>Vidrios</label>
            <select
              name="estado.vidrios"
              value={form.estado.vidrios}
              onChange={handleChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">próximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
          <div>
            <label>Accesorios</label>
            <select
              name="estado.accesorios"
              value={form.estado.accesorios}
              onChange={handleChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">próximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
          <div>
            <label>Producción</label>
            <select
              name="estado.produccion"
              value={form.estado.produccion}
              onChange={handleChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">próximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
          <div>
            <label>Medición</label>
            <select
              name="estado.medicion"
              value={form.estado.medicion}
              onChange={handleChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">próximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
          <div>
            <label>Aprobada</label>
            <select
              name="estado.aprobada"
              value={form.estado.aprobada}
              onChange={handleChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">próximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
        </div>

        {/* saldo */}
        <div>
          <label>Saldo</label>
          <select name="saldo" value={form.saldo} onChange={handleChange}>
            <option value="Con saldo a cobrar">Con saldo a cobrar</option>
            <option value="Pagada">Pagada</option>
          </select>
        </div>

        {/* Observaciones */}
        <div>
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
          />
        </div>

        {/* Botones */}
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end"
          }}
        >
          <button type="submit">{isEdit ? "Actualizar" : "Guardar"}</button>
          <button type="button" onClick={() => onClose(false)}>
            Cancelar
          </button>
        </div>
      </form>
      </ModalBase>

{/* ✅ Modal de Nuevo Cliente (solo se muestra si isClienteModalOpen es true) */}
{isClienteModalOpen && (
  <NuevoCliente onCreated={handleClienteCreado} onClose={() => setIsClienteModalOpen(false)} />
)}
</>
);
}