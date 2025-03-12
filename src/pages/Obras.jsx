// src/pages/Obras.jsx

import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx"; 
import { useAuth } from "../context/AuthContext.jsx";
import * as XLSX from "xlsx"; // Para parsear Excel


export default function Obras() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Lista de obras y clientes
  const [obras, setObras] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Filtro
  const [searchTerm, setSearchTerm] = useState("");

  // Modal principal (crear/editar obra)
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [editingObra, setEditingObra] = useState(null);

  // Sub-modal para crear cliente
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);

  // Sub-modal para materiales
  const [isMaterialesModalOpen, setIsMaterialesModalOpen] = useState(false);

  // Form principal con TODOS los campos (excepto user)
  const [obraForm, setObraForm] = useState({
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
    estadoGeneral: "Presupuestada", // "Presupuestada" | "En Proceso" | "Finalizada"
    estado: {
      perfiles: "pendiente",
      vidrios: "pendiente",
      accesorios: "pendiente",
      produccion: "pendiente",
      medicion: "pendiente",
      aprobada: "pendiente",
    },
    saldo: "Con saldo a cobrar", // "Con saldo a cobrar" | "Pagada"
    observaciones: "",
  });

  // Arrays de materiales (ejemplo: accesoriosPresupuesto)
  // Podrías tener también vidriosPresupuesto, perfilesPresupuesto, etc.
  const [materialesForm, setMaterialesForm] = useState({
    accesoriosPresupuesto: [],
    // ... si deseas otros arrays, agrégalos aquí
  });

  // Form para crear un nuevo cliente
  const [clienteForm, setClienteForm] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
    direccion: { calle: "", ciudad: "" },
    notas: "",
  });

  // 1. Cargar obras/clientes si hay token
  useEffect(() => {
    if (token) {
      fetchObras();
      fetchClientes();
    }
  }, [token]);

  const fetchObras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener obras");
      const data = await res.json();
      setObras(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener clientes");
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 2. Cálculo automático de importeTotal
  useEffect(() => {
    const cf = parseFloat(obraForm.importeConFactura) || 0;
    const sf = parseFloat(obraForm.importeSinFactura) || 0;
    setObraForm((prev) => ({ ...prev, importeTotal: cf + sf }));
  }, [obraForm.importeConFactura, obraForm.importeSinFactura]);

  // 3. Ejemplo: cálculo de fechas derivadas según fechaEntrega
  useEffect(() => {
    if (!obraForm.fechaEntrega) return;
    const entregaDate = new Date(obraForm.fechaEntrega);

    // Resta 10 días => fechaInicioArmado
    const armado = new Date(entregaDate);
    armado.setDate(armado.getDate() - 10);
    const armadoStr = armado.toISOString().slice(0, 10);

    // Resta 5 días => fechaInicioCortePerfiles
    const corte = new Date(entregaDate);
    corte.setDate(corte.getDate() - 5);
    const corteStr = corte.toISOString().slice(0, 10);

    setObraForm((prev) => ({
      ...prev,
      fechaInicioArmado: armadoStr,
      fechaInicioCortePerfiles: corteStr,
    }));
  }, [obraForm.fechaEntrega]);

  // Filtro
  const filteredObras = obras.filter((o) =>
    o.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. Crear nueva obra
  const handleOpenCreate = () => {
    setEditingObra(null);
    setObraForm({
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
        aprobada: "pendiente",
      },
      saldo: "Con saldo a cobrar",
      observaciones: "",
    });
    setMaterialesForm({
      accesoriosPresupuesto: [],
    });
    setIsMainModalOpen(true);
  };

  // 5. Editar
  const handleOpenEdit = (obra) => {
    setEditingObra(obra);
    setObraForm({
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
      estado: {
        perfiles: obra.estado?.perfiles || "pendiente",
        vidrios: obra.estado?.vidrios || "pendiente",
        accesorios: obra.estado?.accesorios || "pendiente",
        produccion: obra.estado?.produccion || "pendiente",
        medicion: obra.estado?.medicion || "pendiente",
        aprobada: obra.estado?.aprobada || "pendiente",
      },
      saldo: obra.saldo || "Con saldo a cobrar",
      observaciones: obra.observaciones || "",
    });
    setMaterialesForm({
      accesoriosPresupuesto: obra.accesoriosPresupuesto || [],
    });
    setIsMainModalOpen(true);
  };

  // 6. Guardar
  const handleSaveObra = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...obraForm, ...materialesForm };

      if (editingObra) {
        // PUT
        const res = await fetch(`${API_URL}/api/obras/${editingObra._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al editar obra");
        const updated = await res.json();
        setObras(obras.map((o) => (o._id === updated._id ? updated : o)));
      } else {
        // POST
        const res = await fetch(`${API_URL}/api/obras`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al crear obra");
        const newObra = await res.json();
        setObras([...obras, newObra]);
      }
      setIsMainModalOpen(false);
    } catch (error) {
      console.error("Error saving obra:", error);
    }
  };

  // 7. Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta obra?")) return;
    try {
      const res = await fetch(`${API_URL}/api/obras/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar obra");
      setObras(obras.filter((o) => o._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Manejo de form principal
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setObraForm({ ...obraForm, [name]: checked });
    } else if (name.startsWith("estado.")) {
      // p.e. "estado.accesorios"
      const campo = name.split(".")[1];
      setObraForm((prev) => ({
        ...prev,
        estado: { ...prev.estado, [campo]: value },
      }));
    } else {
      setObraForm({ ...obraForm, [name]: value });
    }
  };

  // 8. Manejo de sub-modal para materiales
  const handleOpenMateriales = () => {
    setIsMaterialesModalOpen(true);
  };
  const handleCloseMateriales = () => {
    setIsMaterialesModalOpen(false);
  };

  // 9. Sub-modal para crear cliente
  const handleOpenClienteModal = () => {
    setClienteForm({
      nombre: "",
      apellido: "",
      empresa: "",
      email: "",
      telefono: "",
      direccion: { calle: "", ciudad: "" },
      notas: "",
    });
    setIsClienteModalOpen(true);
  };
  const handleCloseClienteModal = () => {
    setIsClienteModalOpen(false);
  };
  const handleClienteFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("direccion.")) {
      const field = name.split(".")[1];
      setClienteForm((prev) => ({
        ...prev,
        direccion: { ...prev.direccion, [field]: value },
      }));
    } else {
      setClienteForm({ ...clienteForm, [name]: value });
    }
  };
  const handleSaveCliente = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clienteForm),
      });
      if (!res.ok) throw new Error("Error al crear cliente");
      const newClient = await res.json();
      setClientes((prev) => [...prev, newClient]);
      // Seleccionar en la obraForm
      setObraForm((prev) => ({ ...prev, cliente: newClient._id }));
      setIsClienteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-contenedor">
      <h1>Obras</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Filtrar obras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleOpenCreate}>+ Agregar Obra</button>
      </div>

      {/* Tarjetas */}
      <div className="obra-list">
        {filteredObras.map((obra) => (
          <div key={obra._id} className="obra-card">
            <div className="obra-card-header">
              <h2>
                {obra.codigoObra} - {obra.nombre}
              </h2>
              <span>
                Entrega: {obra.fechaEntrega ? obra.fechaEntrega.slice(0, 10) : "N/D"}
              </span>
            </div>
            <div className="obra-card-info">
              <p><strong>Dirección:</strong> {obra.direccion}</p>
              <p><strong>Contacto:</strong> {obra.contacto}</p>
              <p>
                <strong>Cliente:</strong>{" "}
                {obra.cliente && obra.cliente.nombre
                  ? `${obra.cliente.nombre} ${obra.cliente.apellido}`
                  : "N/D"}
              </p>
            </div>
            <div className="obra-card-footer">
              <span>
                <strong>Importe Total:</strong> {obra.importeTotal || 0}
              </span>
              <div>
                <button onClick={() => handleOpenEdit(obra)}>Editar</button>
                <button onClick={() => handleDelete(obra._id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal principal (crear/editar) */}
      <ModalBase
        isOpen={isMainModalOpen}
        onClose={() => setIsMainModalOpen(false)}
        title={editingObra ? "Editar Obra" : "Nueva Obra"}
      >
        <form onSubmit={handleSaveObra}>
          {obraForm.codigoObra && (
            <div className="form-group">
              <label>Código Obra</label>
              <input type="text" value={obraForm.codigoObra} disabled />
            </div>
          )}

          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={obraForm.nombre}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Cliente */}
          <div className="form-group">
            <label>Cliente</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select
                name="cliente"
                value={obraForm.cliente}
                onChange={handleInputChange}
              >
                <option value="">-- Seleccionar --</option>
                {clientes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nombre} {c.apellido} {c.empresa ? `(${c.empresa})` : ""}
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleOpenClienteModal}>
                + Nuevo
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={obraForm.direccion}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contacto</label>
            <input
              type="text"
              name="contacto"
              value={obraForm.contacto}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Mapa (URL)</label>
            <input
              type="text"
              name="mapa"
              value={obraForm.mapa}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Fecha de Entrega</label>
            <input
              type="date"
              name="fechaEntrega"
              value={obraForm.fechaEntrega}
              onChange={handleInputChange}
            />
          </div>

          {/* Importes */}
          <div className="form-group">
            <label>Importe c/F</label>
            <input
              type="number"
              name="importeConFactura"
              value={obraForm.importeConFactura}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Importe s/F</label>
            <input
              type="number"
              name="importeSinFactura"
              value={obraForm.importeSinFactura}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Importe Total</label>
            <input type="number" value={obraForm.importeTotal} disabled />
          </div>
          <div className="form-group">
            <label>Índice Actualización</label>
            <input
              type="number"
              name="indiceActualizacionSaldo"
              value={obraForm.indiceActualizacionSaldo}
              onChange={handleInputChange}
            />
          </div>

          {/* Fechas proceso */}
          <div className="form-group">
            <label>Fecha Inicio Corte Perfiles</label>
            <input
              type="date"
              name="fechaInicioCortePerfiles"
              value={obraForm.fechaInicioCortePerfiles}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Fecha Inicio Armado</label>
            <input
              type="date"
              name="fechaInicioArmado"
              value={obraForm.fechaInicioArmado}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Fecha Envidriado</label>
            <input
              type="date"
              name="fechaEnvidriado"
              value={obraForm.fechaEnvidriado}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Fecha Inicio Montaje</label>
            <input
              type="date"
              name="fechaInicioMontaje"
              value={obraForm.fechaInicioMontaje}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Fecha Medición</label>
            <input
              type="date"
              name="fechaMedicion"
              value={obraForm.fechaMedicion}
              onChange={handleInputChange}
            />
          </div>

          {/* Flags */}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="ordenProduccionAprobada"
                checked={obraForm.ordenProduccionAprobada}
                onChange={handleInputChange}
              />
              Orden Producción Aprobada
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="finalObra"
                checked={obraForm.finalObra}
                onChange={handleInputChange}
              />
              Final Obra
            </label>
          </div>

          {/* Estado general */}
          <div className="form-group">
            <label>Estado General</label>
            <select
              name="estadoGeneral"
              value={obraForm.estadoGeneral}
              onChange={handleInputChange}
            >
              <option value="Presupuestada">Presupuestada</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>

          {/* Estado detallado */}
          <div className="form-group">
            <label>Estado Perfiles</label>
            <select
              name="estado.perfiles"
              value={obraForm.estado.perfiles}
              onChange={handleInputChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">proximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
          <div className="form-group">
            <label>Estado Vidrios</label>
            <select
              name="estado.vidrios"
              value={obraForm.estado.vidrios}
              onChange={handleInputChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">proximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
          <div className="form-group">
            <label>Estado Accesorios</label>
            <select
              name="estado.accesorios"
              value={obraForm.estado.accesorios}
              onChange={handleInputChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">proximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
          <div className="form-group">
            <label>Estado Producción</label>
            <select
              name="estado.produccion"
              value={obraForm.estado.produccion}
              onChange={handleInputChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">proximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
          <div className="form-group">
            <label>Estado Medición</label>
            <select
              name="estado.medicion"
              value={obraForm.estado.medicion}
              onChange={handleInputChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">proximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>
          <div className="form-group">
            <label>Estado Aprobada</label>
            <select
              name="estado.aprobada"
              value={obraForm.estado.aprobada}
              onChange={handleInputChange}
            >
              <option value="pendiente">pendiente</option>
              <option value="proximo">proximo</option>
              <option value="cumplido">cumplido</option>
            </select>
          </div>

          <div className="form-group">
            <label>Saldo</label>
            <select name="saldo" value={obraForm.saldo} onChange={handleInputChange}>
              <option value="Con saldo a cobrar">Con saldo a cobrar</option>
              <option value="Pagada">Pagada</option>
            </select>
          </div>

          <div className="form-group">
            <label>Observaciones</label>
            <textarea
              name="observaciones"
              value={obraForm.observaciones}
              onChange={handleInputChange}
            />
          </div>

          {/* Botón para abrir sub-modal de materiales */}
          <button type="button" onClick={handleOpenMateriales}>
            Editar Materiales (Accesorios)
          </button>

          <div className="form-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setIsMainModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>

      {/* Sub-modal para materiales: Importar Excel + vista previa */}
      <MaterialesModal
        isOpen={isMaterialesModalOpen}
        onClose={handleCloseMateriales}
        title="Accesorios Presupuestados"
        items={materialesForm.accesoriosPresupuesto}
        setItems={(newItems) =>
          setMaterialesForm({ ...materialesForm, accesoriosPresupuesto: newItems })
        }
      />

      {/* Sub-modal para crear nuevo cliente */}
      <ModalBase
        isOpen={isClienteModalOpen}
        onClose={handleCloseClienteModal}
        title="Nuevo Cliente"
      >
        <form onSubmit={handleSaveCliente}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={clienteForm.nombre}
              onChange={handleClienteFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={clienteForm.apellido}
              onChange={handleClienteFormChange}
            />
          </div>
          <div className="form-group">
            <label>Empresa</label>
            <input
              type="text"
              name="empresa"
              value={clienteForm.empresa}
              onChange={handleClienteFormChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={clienteForm.email}
              onChange={handleClienteFormChange}
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={clienteForm.telefono}
              onChange={handleClienteFormChange}
            />
          </div>
          <div className="form-group">
            <label>Dirección (Calle)</label>
            <input
              type="text"
              name="direccion.calle"
              value={clienteForm.direccion.calle}
              onChange={handleClienteFormChange}
            />
          </div>
          <div className="form-group">
            <label>Dirección (Ciudad)</label>
            <input
              type="text"
              name="direccion.ciudad"
              value={clienteForm.direccion.ciudad}
              onChange={handleClienteFormChange}
            />
          </div>
          <div className="form-group">
            <label>Notas</label>
            <textarea
              name="notas"
              value={clienteForm.notas}
              onChange={handleClienteFormChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit">Crear Cliente</button>
            <button type="button" onClick={handleCloseClienteModal}>
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Sub-componente: MaterialesModal
   Permite importar Excel y previsualizar datos antes de agregarlos a items
-------------------------------------------------------------------------- */
function MaterialesModal({ isOpen, onClose, title, items, setItems }) {
  const [previewData, setPreviewData] = useState([]);

  // Maneja la importación de Excel
  const handleImportExcel = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Asumiendo fila 0 => headers, fila 1.. => datos
        const rows = jsonData.slice(1).map((row) => ({
          codigo: row[0] || "",
          descripcion: row[1] || "",
          cantidad: parseFloat(row[2]) || 0,
          precio: parseFloat(row[3]) || 0,
        }));

        setPreviewData(rows);
      } catch (error) {
        console.error("Error al leer Excel:", error);
        alert("Error al importar Excel");
      }
    };
    input.click();
  };

  // Agregar previewData a items
  const handleAddPreviewToItems = () => {
    setItems([...items, ...previewData]);
    setPreviewData([]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>
        <h2>{title}</h2>
        <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <button onClick={handleImportExcel}>Importar Excel</button>

          {/* Preview */}
          {previewData.length > 0 && (
            <div style={{ margin: "1rem 0" }}>
              <h3>Datos Importados (Preview)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.codigo}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.cantidad}</td>
                      <td>{item.precio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleAddPreviewToItems}>
                Agregar estos {previewData.length} items
              </button>
            </div>
          )}

          {/* Items ya confirmados */}
          <h3>Items Actuales</h3>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.codigo}</td>
                  <td>{item.descripcion}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
