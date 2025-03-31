/* // src/pages/BaseMateriales.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/modals/ModalBase";
import Button from "../components/ui/Button.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/general";

const BaseMateriales = () => {
  const [tab, setTab] = useState("perfiles"); // "perfiles" o "vidrios"
  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [nuevoPerfil, setNuevoPerfil] = useState({
    descripcion: "",
    extrusora: "",
  });
  const [nuevoVidrio, setNuevoVidrio] = useState({
    descripcion: "",
    espesor: "",
  });
  const [archivoPerfiles, setArchivoPerfiles] = useState(null);
  const [archivoVidrios, setArchivoVidrios] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [modalPerfilesOpen, setModalPerfilesOpen] = useState(false);
  const [modalVidriosOpen, setModalVidriosOpen] = useState(false);
  const [modalImportarOpen, setModalImportarOpen] = useState(false);

  useEffect(() => {
    fetchPerfiles();
    fetchVidrios();
  }, []);

  const fetchPerfiles = async () => {
    try {
      const res = await fetch(`${API_URL}/perfiles`);
      if (!res.ok) throw new Error("Error al obtener perfiles");
      const data = await res.json();
      setPerfiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setPerfiles([]);
    }
  };

  const fetchVidrios = async () => {
    try {
      const res = await fetch(`${API_URL}/vidrios`);
      if (!res.ok) throw new Error("Error al obtener vidrios");
      const data = await res.json();
      setVidrios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setVidrios([]);
    }
  };

  const handleAgregarPerfil = async () => {
    await fetch(`${API_URL}/perfiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPerfil),
    });
    fetchPerfiles();
    setModalPerfilesOpen(false);
  };

  const handleAgregarVidrio = async () => {
    await fetch(`${API_URL}/vidrios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoVidrio),
    });
    fetchVidrios();
    setModalVidriosOpen(false);
  };

  const handleArchivoPerfiles = (e) => setArchivoPerfiles(e.target.files[0]);
  const handleArchivoVidrios = (e) => setArchivoVidrios(e.target.files[0]);

  const subirArchivo = async (tipo) => {
    if (
      (tipo === "perfiles" && !archivoPerfiles) ||
      (tipo === "vidrios" && !archivoVidrios)
    ) {
      alert("Selecciona un archivo antes de subirlo.");
      return;
    }
    const formData = new FormData();
    formData.append(
      "file",
      tipo === "perfiles" ? archivoPerfiles : archivoVidrios
    );
    try {
      const res = await fetch(`${API_URL}/${tipo}/importar`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMensaje(data.message);
      setModalImportarOpen(false);
      fetchPerfiles();
      fetchVidrios();
    } catch (error) {
      setMensaje("Error al importar datos");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Base de Datos General</h1>

      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          margin: "10px 0px 10px 10px",
          display: "flex",
          flexWrap: "wrap",
          color: "gray",
          gap: "50px",
        }}
      >
        <div onClick={() => setTab("perfiles")}>Perfiles</div>

        <div onClick={() => setTab("vidrios")}>Vidrios</div>
      </div>

      {tab === "perfiles" && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            color: "gray",
            gap: "50px",
          }}
        >
          <Button onClick={() => setModalPerfilesOpen(true)}>
            + Agregar Perfil
          </Button>
          <Button onClick={() => setModalImportarOpen(true)}>
            Importar Excel
          </Button>
          <ul>
            {perfiles.map((p) => (
              <li key={p._id}>
                {p.descripcion} - {p.extrusora}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "vidrios" && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            color: "gray",
            gap: "50px",
          }}
        >
          <Button onClick={() => setModalVidriosOpen(true)}>
            + Agregar Vidrio
          </Button>
          <Button onClick={() => setModalImportarOpen(true)}>
            Importar Excel
          </Button>
          <ul>
            {vidrios.map((v) => (
              <li key={v._id}>
                {v.descripcion} - {v.espesor} mm
              </li>
            ))}
          </ul>
        </div>
      )}

      {modalPerfilesOpen && (
        <ModalBase
          onClose={() => setModalPerfilesOpen(false)}
          title="Agregar Perfil"
        >
          <input
            type="text"
            placeholder="Descripción"
            onChange={(e) =>
              setNuevoPerfil({ ...nuevoPerfil, descripcion: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Extrusora"
            onChange={(e) =>
              setNuevoPerfil({ ...nuevoPerfil, extrusora: e.target.value })
            }
          />
          <Button onClick={handleAgregarPerfil}>Guardar</Button>
        </ModalBase>
      )}

      {modalVidriosOpen && (
        <ModalBase
          onClose={() => setModalVidriosOpen(false)}
          title="Agregar Vidrio"
        >
          <input
            type="text"
            placeholder="Descripción"
            onChange={(e) =>
              setNuevoVidrio({ ...nuevoVidrio, descripcion: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Espesor (mm)"
            onChange={(e) =>
              setNuevoVidrio({ ...nuevoVidrio, espesor: e.target.value })
            }
          />
          <Button onClick={handleAgregarVidrio}>Guardar</Button>
        </ModalBase>
      )}

      {modalImportarOpen && (
        <ModalBase
          onClose={() => setModalImportarOpen(false)}
          title="Importar Datos"
        >
          <h3>Importar Perfiles</h3>
          <input type="file" accept=".xlsx" onChange={handleArchivoPerfiles} />
          <Button onClick={() => subirArchivo("perfiles")}>Subir</Button>
          <h3>Importar Vidrios</h3>
          <input type="file" accept=".xlsx" onChange={handleArchivoVidrios} />
          <Button onClick={() => subirArchivo("vidrios")}>Subir</Button>
        </ModalBase>
      )}

      {mensaje && <p className={styles.message}>{mensaje}</p>}
    </div>
  );
};

export default BaseMateriales;
 */
import React, { useState, useEffect } from "react";
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

  const [busqueda, setBusqueda] = useState("");

  const [modalTipo, setModalTipo] = useState(null); // 'perfiles', 'vidrios', etc.
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
  };

  const fetchData = async (tipo, setter) => {
    try {
      const res = await fetch(`${API_URL}/api/general/${tipo}`);
      const data = await res.json();
      setter(Array.isArray(data) ? data : []);
    } catch {
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
    const formData = new FormData();
    formData.append("file", archivoImportado);

    const res = await fetch(`${API_URL}/api/general/${modalImportarTipo}/importar`, {
      method: "POST",
      body: formData,
    });

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
      default: return () => {};
    }
  };
  const dataMap = {
    perfiles: perfiles,
    vidrios: vidrios,
    camaras: camaras,
    accesorios: accesorios,
  };

  const headersMap = {
    perfiles: ["Código", "Descripción", "Extrusora", "Línea"],
    vidrios: ["Descripción", "Espesor"],
    camaras: ["Descripción", "Espesor"],
    accesorios: ["Código", "Descripción", "Color", "Tipo"],
  };

  const filteredData = dataMap[tab].filter((item) =>
    Object.values(item).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return (
    <div className={styles.pageContainer}>
      <h1>Base de Datos General</h1>

      <nav style={{ display: "flex", gap: "30px", fontWeight: "bold", marginBottom: "20px" }}>
        {["perfiles", "vidrios", "camaras", "accesorios"].map((tipo) => (
          <div key={tipo} style={{ cursor: "pointer" }} onClick={() => setTab(tipo)}>
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
        headers={[...headersMap[tab], "Acciones"]}
        data={filteredData}
        renderRow={(item) => (
          <>
            {headersMap[tab].map((key) => (
              <td key={key}>{item[key.toLowerCase()] || item.descripcion || item.codigo}</td>
            ))}
            <td>
              <Button variant="secondary" onClick={() => abrirModal(tab, item)}>Editar</Button>
              <Button variant="danger" onClick={() => handleEliminar(tab, item._id)}>Eliminar</Button>
            </td>
          </>
        )}
      />

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
    onSubmit(form);
  };

  const campos = {
    perfiles: [
      { name: "codigo", placeholder: "Código" },
      { name: "descripcion", placeholder: "Descripción" },
      { name: "extrusora", placeholder: "Extrusora" },
      { name: "linea", placeholder: "Línea" },
      { name: "largo", placeholder: "Largo (mm)", type: "number" },
      { name: "pesoxmetro", placeholder: "Peso x metro", type: "number" },
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
      { name: "unidad", placeholder: "Unidad", defaultValue: "u" },
      { name: "tipo", placeholder: "Tipo" },
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
      <Button onClick={handleSubmit}>{data?._id ? "Actualizar" : "Guardar"}</Button>
    </>
  );
};
