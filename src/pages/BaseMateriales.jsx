import React, { useState, useEffect } from "react";
import Select from "react-select";

import ModalBase from "../components/modals/ModalBase";
import Button from "../components/ui/Button.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";

import Table from "../components/ui/Table.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";

const API_URL = import.meta.env.VITE_API_URL;

const BaseMateriales = () => {
  const [tab, setTab] = useState("perfiles");

  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [camaras, setCamaras] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [modalTipo, setModalTipo] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  const [archivoImportado, setArchivoImportado] = useState(null);
  const [modalImportarTipo, setModalImportarTipo] = useState(null);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = () => {
    fetchData("perfiles", setPerfiles);
    fetchData("vidrios", setVidrios);
    fetchData("camaras", setCamaras);
    fetchData("accesorios", setAccesorios);
    fetchData("proveedores", setProveedores);
  };

  const fetchData = async (tipo, setter) => {
    try {
      const res = await fetch(`${API_URL}/api/general/${tipo}`);
      const data = await res.json();
      setter(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(`❌ Error cargando ${tipo}:`, error);
      setter([]);
    }
  };

  const abrirModal = (tipo, item = null) => {
    setModalTipo(tipo);
    setItemSeleccionado(item);
    setModoEdicion(!!item);
  };

  const cerrarModal = () => {
    setModalTipo(null);
    setItemSeleccionado(null);
    setModoEdicion(false);
  };

  const handleGuardar = async (tipo, datos) => {
    const url = `${API_URL}/api/general/${tipo}${modoEdicion ? `/${itemSeleccionado._id}` : ""}`;
    const method = modoEdicion ? "PUT" : "POST";

    if (tipo === "proveedores") {
      emails: Array.isArray(datos.emails)
      ? datos.emails
      : datos.emails?.toString().split(",").map(e => e.trim())
      telefono: Array.isArray(datos.telefono)
      ? datos.telefono
      : datos.telefono?.toString().split(",").map(t => t.trim()).filter(Boolean)
      whatsapp: Array.isArray(datos.whatsapp)
      ? datos.whatsapp
      : datos.whatsapp?.toString().split(",").map(w => w.trim()).filter(Boolean)
    
    marcas: Array.isArray(datos.marcas)
      ? datos.marcas
      : datos.marcas?.toString().split(",").map(m => m.trim()).filter(Boolean)
    
    rubro: Array.isArray(datos.rubro)
      ? datos.rubro
      : datos.rubro?.toString().split(",").map(r => r.trim()).filter(Boolean)
    }

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    cerrarModal();
    fetchData(tipo, getSetter(tipo));
  };

  const handleEliminar = async (tipo, id) => {
    if (!window.confirm("¿Estás seguro de eliminar este elemento?")) return;
    await fetch(`${API_URL}/api/general/${tipo}/${id}`, { method: "DELETE" });
    fetchData(tipo, getSetter(tipo));
  };

  const subirArchivo = async () => {
    if (!archivoImportado || !modalImportarTipo) return;
    const tipo = modalImportarTipo; // guardá antes de limpiar
    const formData = new FormData();
    formData.append("file", archivoImportado);
  
    const res = await fetch(
      `${API_URL}/api/general/${tipo}/importar`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    const data = await res.json();
    setMensaje(data.message || "Importado con éxito");
    setModalImportarTipo(null);
    setArchivoImportado(null);
    fetchData(modalImportarTipo, getSetter(modalImportarTipo));
  };

  const getSetter = (tipo) => {
    switch (tipo) {
      case "perfiles": return setPerfiles;
      case "vidrios": return setVidrios;
      case "camaras": return setCamaras;
      case "accesorios": return setAccesorios;
      case "proveedores": return setProveedores;
      default: return () => {};
    }
  };

  const dataMap = { perfiles, vidrios, camaras, accesorios, proveedores };

  const headersMap = {
    perfiles: {
      codigo: "Código",
      descripcion: "Descripción",
      extrusora: "Extrusora",
      linea: "Línea",
      largo: "Largo (mm)",
      peso: "Peso x metro",
    },
    vidrios: { descripcion: "Descripción", espesor: "Espesor" },
    camaras: { descripcion: "Descripción", espesor: "Espesor" },
    accesorios: {
      codigo: "Código",
      descripcion: "Descripción",
      color: "Color",
      tipo: "Tipo",
    },
    proveedores: {
      nombre: "Nombre",
      direccion: "Dirección",
      emails: "Emails",
      telefono: "Teléfonos",
      whatsapp: "WhatsApp",
      marcas: "Marcas",
      rubro: "Rubros",
    },
  };

  const filteredData = dataMap[tab].filter((item) =>
    Object.values(item).some((val) =>
      String(Array.isArray(val) ? val.join(", ") : val ?? "")
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    const aStr = Array.isArray(aVal) ? aVal.join(", ") : String(aVal ?? "");
    const bStr = Array.isArray(bVal) ? bVal.join(", ") : String(bVal ?? "");
    return sortConfig.direction === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const ordenarPor = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Base de Datos General</h1>

      <nav style={{ display: "flex", gap: "30px", fontWeight: "bold", marginBottom: "20px" }}>
        {["perfiles", "vidrios", "camaras", "accesorios", "proveedores"].map((tipo) => (
          <div
            key={tipo}
            style={{ cursor: "pointer", color: tab === tipo ? "black" : "gray" }}
            onClick={() => setTab(tipo)}
          >
            {tipo.toUpperCase()}
          </div>
        ))}
      </nav>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <Button onClick={() => abrirModal(tab)}>+ Agregar</Button>
        <Button onClick={() => setModalImportarTipo(tab)}>Importar Excel</Button>
        <SearchBar value={busqueda} onChange={setBusqueda} placeholder={`Buscar ${tab}...`} />
      </div>

      <Table
        headers={Object.entries(headersMap[tab])
          .map(([key, label]) => ({ key, label }))
          .concat({ key: "acciones", label: "Acciones" })}
        onSort={ordenarPor}
        sortConfig={sortConfig}
      >
        {sortedData.map((item) => (
          <tr key={item._id}>
            {Object.keys(headersMap[tab]).map((key) => (
              <td key={key}>
                {Array.isArray(item[key]) ? item[key].join(", ") : item[key] ?? ""}
              </td>
            ))}
            <td>
              <Button variant="secondary" onClick={() => abrirModal(tab, item)}>Editar</Button>
              <Button variant="danger" onClick={() => handleEliminar(tab, item._id)}>Eliminar</Button>
            </td>
          </tr>
        ))}
      </Table>

      <ModalBase isOpen={!!modalTipo} onClose={cerrarModal} title={modoEdicion ? "Editar" : "Agregar"}>
        <DynamicForm tipo={modalTipo} data={itemSeleccionado} onSubmit={(data) => handleGuardar(modalTipo, data)} />
      </ModalBase>

      <ModalBase isOpen={!!modalImportarTipo} onClose={() => setModalImportarTipo(null)} title={`Importar ${modalImportarTipo}`}>
        <input type="file" accept=".xlsx" onChange={(e) => setArchivoImportado(e.target.files[0])} />
        <Button onClick={subirArchivo}>Subir</Button>
      </ModalBase>

      {mensaje && <p style={{ marginTop: "15px", color: "green" }}>{mensaje}</p>}
    </div>
  );
};

export default BaseMateriales;

const DynamicForm = ({ tipo, data = {}, onSubmit }) => {
  const [form, setForm] = useState({ ...data });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const camposArray = ["emails", "telefono", "whatsapp", "marcas", "rubro"];
    const normalizado = { ...form };

    camposArray.forEach((campo) => {
      if (typeof normalizado[campo] === "string") {
        normalizado[campo] = normalizado[campo]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    });

    onSubmit(normalizado);
  };

  const campos = {
    perfiles: [
      { name: "codigo", placeholder: "Código" },
      { name: "descripcion", placeholder: "Descripción" },
      { name: "extrusora", placeholder: "Extrusora" },
      { name: "linea", placeholder: "Línea" },
      { name: "largo", placeholder: "Largo (mm)", type: "number" },
      { name: "peso", placeholder: "Peso x metro", type: "number" },
    ],
    vidrios: [
      { name: "descripcion", placeholder: "Descripción" },
      { name: "espesor", placeholder: "Espesor (mm)", type: "number" },
    ],
    camaras: [
      { name: "descripcion", placeholder: "Descripción" },
      { name: "espesor", placeholder: "Espesor (mm)", type: "number" },
    ],
    accesorios: [
      { name: "codigo", placeholder: "Código" },
      { name: "descripcion", placeholder: "Descripción" },
      { name: "color", placeholder: "Color" },
      { name: "cantidad", placeholder: "Cantidad", type: "number" },
      { name: "unidad", placeholder: "Unidad" },
      { name: "tipo", placeholder: "Tipo" },
    ],
    proveedores: [
      { name: "nombre", placeholder: "Nombre" },
      { name: "direccion", placeholder: "Dirección" },
      { name: "emails", placeholder: "Emails (coma)" },
      { name: "telefono", placeholder: "Teléfonos (coma)" },
      { name: "whatsapp", placeholder: "WhatsApp (coma)" },
      { name: "marcas", placeholder: "Marcas (coma)" },
        ],
  };

  return (
    <>
      {campos[tipo].map((field) => (
        <input
          key={field.name}
          name={field.name}
          type={field.type || "text"}
          placeholder={field.placeholder}
          value={form[field.name] || ""}
          onChange={handleChange}
        />
      ))}
      {tipo === "proveedores" && (
  <div style={{ marginTop: "10px" }}>
    <label><strong>Rubros:</strong></label>
    <Select
      options={[
        { value: "Vidrio", label: "Vidrio" },
        { value: "Perfiles", label: "Perfiles" },
        { value: "Accesorios", label: "Accesorios" },
        { value: "Insumos", label: "Insumos" },
      ]}
      isMulti
      value={(form.rubro || []).map((r) => ({ value: r, label: r }))}
      onChange={(selected) =>
        setForm((prev) => ({
          ...prev,
          rubro: selected.map((s) => s.value),
        }))
      }
    />
  </div>
)}

      <Button onClick={handleSubmit}>{data?._id ? "Actualizar" : "Guardar"}</Button>
    </>
  );
};
