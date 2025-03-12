import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";


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

  // Sub-modal para materiales (perfiles, vidrios, accesorios)
  const [isMaterialesModalOpen, setIsMaterialesModalOpen] = useState(false);

  // Sub-modal para crear cliente
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);

  // Form principal con TODOS los campos del modelo (excepto arrays que van a sub-modal)
  const [obraForm, setObraForm] = useState({
    // Autoincremental, no editable
    codigoObra: "",

    // Datos principales
    nombre: "",
    cliente: "", // guardaremos el _id del cliente
    direccion: "",
    contacto: "",
    mapa: "",
    fechaEntrega: "",
    
    // Importes
    importeConFactura: 0,
    importeSinFactura: 0,
    importeTotal: 0,
    indiceActualizacionSaldo: 0,

    // Fechas de proceso
    fechaInicioCortePerfiles: "",
    fechaInicioArmado: "",
    fechaEnvidriado: "",
    fechaInicioMontaje: "",
    fechaMedicion: "",

    // Flags
    ordenProduccionAprobada: false,
    finalObra: false,

    // Estado general
    estadoGeneral: "Presupuestada", // "Presupuestada" | "En Proceso" | "Finalizada"

    // Estado detallado
    estado: {
      perfiles: "pendiente",
      vidrios: "pendiente",
      accesorios: "pendiente",
      produccion: "pendiente",
      medicion: "pendiente",
      aprobada: "pendiente",
    },

    // Saldo y observaciones
    saldo: "Con saldo a cobrar", // "Con saldo a cobrar" | "Pagada"
    observaciones: "",
  });

  // Subcampos de materiales
  const [materialesForm, setMaterialesForm] = useState({
    perfilesPresupuesto: [],
    vidriosPresupuesto: [],
    accesoriosPresupuesto: [],
  });

  // Form para crear nuevo cliente
  const [clienteForm, setClienteForm] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
    direccion: { calle: "", ciudad: "" },
    notas: "",
  });

  // 1. Cargar obras y clientes al montar (si hay token)
  useEffect(() => {
    if (token) {
      fetchObras();
      fetchClientes();
    }
  }, [token]);

  const fetchObras = async () => {
    try {
      // Pedimos /api/obras? populada con "cliente" para ver {cliente: { _id, nombre, ... }}
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

  // 2. useEffect para calcular importeTotal en tiempo real
  useEffect(() => {
    const cf = parseFloat(obraForm.importeConFactura) || 0;
    const sf = parseFloat(obraForm.importeSinFactura) || 0;
    setObraForm((prev) => ({
      ...prev,
      importeTotal: cf + sf,
    }));
  }, [obraForm.importeConFactura, obraForm.importeSinFactura]);

  // 3. useEffect para calcular fechas derivadas en tiempo real (ejemplo)
  useEffect(() => {
    if (!obraForm.fechaEntrega) return;
    const entregaDate = new Date(obraForm.fechaEntrega);

    // Ejemplo: restar 10 días => fechaInicioArmado
    const armadoDate = new Date(entregaDate);
    armadoDate.setDate(armadoDate.getDate() - 10);
    const armadoStr = armadoDate.toISOString().slice(0, 10);

    // Ejemplo: restar 5 días => fechaInicioCortePerfiles
    const corteDate = new Date(entregaDate);
    corteDate.setDate(corteDate.getDate() - 5);
    const corteStr = corteDate.toISOString().slice(0, 10);

    // Ejemplo: sumarle 2 días => fechaEnvidriado
    const envidDate = new Date(entregaDate);
    envidDate.setDate(envidDate.getDate() + 2);
    const envidStr = envidDate.toISOString().slice(0, 10);

    // Ejemplo: sumarle 4 días => fechaInicioMontaje
    const montDate = new Date(entregaDate);
    montDate.setDate(montDate.getDate() + 4);
    const montStr = montDate.toISOString().slice(0, 10);

    // Ejemplo: restar 15 días => fechaMedicion
    const medDate = new Date(entregaDate);
    medDate.setDate(medDate.getDate() - 15);
    const medStr = medDate.toISOString().slice(0, 10);

    setObraForm((prev) => ({
      ...prev,
      fechaInicioArmado: armadoStr,
      fechaInicioCortePerfiles: corteStr,
      fechaEnvidriado: envidStr,
      fechaInicioMontaje: montStr,
      fechaMedicion: medStr,
    }));
  }, [obraForm.fechaEntrega]);

  // Filtro de obras
  const filteredObras = obras.filter((o) =>
    o.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. Crear nueva Obra
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
      perfilesPresupuesto: [],
      vidriosPresupuesto: [],
      accesoriosPresupuesto: [],
    });
    setIsMainModalOpen(true);
  };

  // 5. Editar Obra
  const handleOpenEdit = (obra) => {
    setEditingObra(obra);

    setObraForm({
      codigoObra: obra.codigoObra || "",
      nombre: obra.nombre || "",
      cliente: obra.cliente?._id || "", // si se populó en backend
      direccion: obra.direccion || "",
      contacto: obra.contacto || "",
      mapa: obra.mapa || "",
      fechaEntrega: obra.fechaEntrega
        ? obra.fechaEntrega.slice(0, 10)
        : "",
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
      perfilesPresupuesto: obra.perfilesPresupuesto || [],
      vidriosPresupuesto: obra.vidriosPresupuesto || [],
      accesoriosPresupuesto: obra.accesoriosPresupuesto || [],
    });

    setIsMainModalOpen(true);
  };

  // 6. Guardar (POST/PUT)
  const handleSaveObra = async (e) => {
    e.preventDefault();
    try {
      // Combinar form principal y materiales
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
  const handleDelete = async (obraId) => {
    if (!confirm("¿Seguro que deseas eliminar esta obra?")) return;
    try {
      const res = await fetch(`${API_URL}/api/obras/${obraId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar obra");
      setObras(obras.filter((o) => o._id !== obraId));
    } catch (error) {
      console.error(error);
    }
  };

  // Manejo de form principal
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Si es checkbox (ordenProduccionAprobada, finalObra, etc.)
    if (type === "checkbox") {
      setObraForm({ ...obraForm, [name]: checked });
    } else if (name.startsWith("estado.")) {
      // Por ejemplo "estado.perfiles"
      const campo = name.split(".")[1]; // "perfiles"
      setObraForm((prev) => ({
        ...prev,
        estado: { ...prev.estado, [campo]: value },
      }));
    } else {
      setObraForm({ ...obraForm, [name]: value });
    }
  };

  // 8. Sub-modal de materiales
  const handleOpenMaterialesModal = () => {
    setIsMaterialesModalOpen(true);
  };
  const handleCloseMaterialesModal = () => {
    setIsMaterialesModalOpen(false);
  };

  const handleAddMaterial = (type) => {
    const newItem = { codigo: "", descripcion: "", cantidad: 1, precio: 0 };
    setMaterialesForm((prev) => ({
      ...prev,
      [type]: [...prev[type], newItem],
    }));
  };

  const handleMaterialChange = (type, index, field, value) => {
    const arr = [...materialesForm[type]];
    arr[index][field] = value;
    setMaterialesForm((prev) => ({
      ...prev,
      [type]: arr,
    }));
  };

  const handleRemoveMaterial = (type, index) => {
    const arr = [...materialesForm[type]];
    arr.splice(index, 1);
    setMaterialesForm((prev) => ({
      ...prev,
      [type]: arr,
    }));
  };

  const handleImportExcel = (type) => {
    alert(`Importar Excel para ${type} (no implementado)`);
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
      const field = name.split(".")[1]; // "calle" o "ciudad"
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
      // Agregar a la lista
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

      {/* Filtro */}
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
                Entrega:{" "}
                {obra.fechaEntrega
                  ? obra.fechaEntrega.slice(0, 10)
                  : "N/D"}
              </span>
            </div>
            <div className="obra-card-info">
              <p>
                <strong>Dirección:</strong> {obra.direccion}
              </p>
              <p>
                <strong>Contacto:</strong> {obra.contacto}
              </p>
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
          {/* codigoObra => no editable */}
          {obraForm.codigoObra && (
            <div className="form-group">
              <label>Código Obra</label>
              <input type="text" value={obraForm.codigoObra} disabled />
            </div>
          )}

          {/* Nombre */}
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

          {/* Cliente (select + botón "Nuevo") */}
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

          {/* Dirección, Contacto, Mapa */}
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

          {/* FechaEntrega */}
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
            <label>Importe Total (auto)</label>
            <input type="number" value={obraForm.importeTotal} disabled />
          </div>
          <div className="form-group">
            <label>Indice Actualización</label>
            <input
              type="number"
              name="indiceActualizacionSaldo"
              value={obraForm.indiceActualizacionSaldo}
              onChange={handleInputChange}
            />
          </div>

          {/* Fechas de proceso (auto o manual) */}
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

          {/* Estado General */}
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

          {/* Saldo */}
          <div className="form-group">
            <label>Saldo</label>
            <select
              name="saldo"
              value={obraForm.saldo}
              onChange={handleInputChange}
            >
              <option value="Con saldo a cobrar">Con saldo a cobrar</option>
              <option value="Pagada">Pagada</option>
            </select>
          </div>

          {/* Observaciones */}
          <div className="form-group">
            <label>Observaciones</label>
            <textarea
              name="observaciones"
              value={obraForm.observaciones}
              onChange={handleInputChange}
            />
          </div>

          {/* Botón para abrir sub-modal de materiales */}
          <button type="button" onClick={handleOpenMaterialesModal}>
            Editar Materiales Presupuestados
          </button>

          <div className="form-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setIsMainModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>

      {/* Sub-modal para materiales */}
      <ModalBase
        isOpen={isMaterialesModalOpen}
        onClose={handleCloseMaterialesModal}
        title="Materiales Presupuestados"
      >
        {/* Perfiles */}
        <div className="material-section">
          <h3>Perfiles</h3>
          <button onClick={() => handleAddMaterial("perfilesPresupuesto")}>
            + Agregar Perfil
          </button>
          <button onClick={() => handleImportExcel("perfilesPresupuesto")}>
            Importar Excel
          </button>
          <ul>
            {materialesForm.perfilesPresupuesto.map((item, idx) => (
              <li key={idx} className="material-item">
                <input
                  type="text"
                  placeholder="Código"
                  value={item.codigo}
                  onChange={(e) =>
                    handleMaterialChange(
                      "perfilesPresupuesto",
                      idx,
                      "codigo",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={item.descripcion}
                  onChange={(e) =>
                    handleMaterialChange(
                      "perfilesPresupuesto",
                      idx,
                      "descripcion",
                      e.target.value
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={item.cantidad}
                  onChange={(e) =>
                    handleMaterialChange(
                      "perfilesPresupuesto",
                      idx,
                      "cantidad",
                      e.target.value
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={item.precio || 0}
                  onChange={(e) =>
                    handleMaterialChange(
                      "perfilesPresupuesto",
                      idx,
                      "precio",
                      e.target.value
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleRemoveMaterial("perfilesPresupuesto", idx)
                  }
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Vidrios */}
        <div className="material-section">
          <h3>Vidrios</h3>
          <button onClick={() => handleAddMaterial("vidriosPresupuesto")}>
            + Agregar Vidrio
          </button>
          <button onClick={() => handleImportExcel("vidriosPresupuesto")}>
            Importar Excel
          </button>
          <ul>
            {materialesForm.vidriosPresupuesto.map((item, idx) => (
              <li key={idx} className="material-item">
                <input
                  type="text"
                  placeholder="Código"
                  value={item.codigo || ""}
                  onChange={(e) =>
                    handleMaterialChange(
                      "vidriosPresupuesto",
                      idx,
                      "codigo",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={item.descripcion || ""}
                  onChange={(e) =>
                    handleMaterialChange(
                      "vidriosPresupuesto",
                      idx,
                      "descripcion",
                      e.target.value
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={item.cantidad || 1}
                  onChange={(e) =>
                    handleMaterialChange(
                      "vidriosPresupuesto",
                      idx,
                      "cantidad",
                      e.target.value
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={item.precio || 0}
                  onChange={(e) =>
                    handleMaterialChange(
                      "vidriosPresupuesto",
                      idx,
                      "precio",
                      e.target.value
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleRemoveMaterial("vidriosPresupuesto", idx)
                  }
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Accesorios */}
        <div className="material-section">
          <h3>Accesorios</h3>
          <button onClick={() => handleAddMaterial("accesoriosPresupuesto")}>
            + Agregar Accesorio
          </button>
          <button onClick={() => handleImportExcel("accesoriosPresupuesto")}>
            Importar Excel
          </button>
          <ul>
            {materialesForm.accesoriosPresupuesto.map((item, idx) => (
              <li key={idx} className="material-item">
                <input
                  type="text"
                  placeholder="Código"
                  value={item.codigo || ""}
                  onChange={(e) =>
                    handleMaterialChange(
                      "accesoriosPresupuesto",
                      idx,
                      "codigo",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={item.descripcion || ""}
                  onChange={(e) =>
                    handleMaterialChange(
                      "accesoriosPresupuesto",
                      idx,
                      "descripcion",
                      e.target.value
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={item.cantidad || 1}
                  onChange={(e) =>
                    handleMaterialChange(
                      "accesoriosPresupuesto",
                      idx,
                      "cantidad",
                      e.target.value
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={item.precio || 0}
                  onChange={(e) =>
                    handleMaterialChange(
                      "accesoriosPresupuesto",
                      idx,
                      "precio",
                      e.target.value
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleRemoveMaterial("accesoriosPresupuesto", idx)
                  }
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <button onClick={handleCloseMaterialesModal}>Cerrar</button>
        </div>
      </ModalBase>

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
