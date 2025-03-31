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
import styles from "../styles/pages/GlobalStylePages.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/general";

const BaseMateriales = () => {
  const [tab, setTab] = useState("perfiles");

  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [camaras, setCamaras] = useState([]);
  const [accesorios, setAccesorios] = useState([]);

  const [nuevoPerfil, setNuevoPerfil] = useState({
    codigo: "",
    descripcion: "",
    extrusora: "",
    linea: "",
    largo: 0,
    pesoxmetro: 0,
  });

  const [nuevoVidrio, setNuevoVidrio] = useState({
    descripcion: "",
    espesor: 0,
  });

  const [nuevaCamara, setNuevaCamara] = useState({
    descripcion: "",
    espesor: 0,
  });

  const [nuevoAccesorio, setNuevoAccesorio] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 0,
    unidad: "u",
    tipo: "",
  });

  const [archivoPerfiles, setArchivoPerfiles] = useState(null);
  const [archivoVidrios, setArchivoVidrios] = useState(null);
  const [archivoCamaras, setArchivoCamaras] = useState(null);
  const [archivoAccesorios, setArchivoAccesorios] = useState(null);

  const [mensaje, setMensaje] = useState("");

  const [modalPerfilesOpen, setModalPerfilesOpen] = useState(false);
  const [modalVidriosOpen, setModalVidriosOpen] = useState(false);
  const [modalCamarasOpen, setModalCamarasOpen] = useState(false);
  const [modalAccesoriosOpen, setModalAccesoriosOpen] = useState(false);
  const [modalImportarOpen, setModalImportarOpen] = useState(false);

  useEffect(() => {
    fetchPerfiles();
    fetchVidrios();
    fetchCamaras();
    fetchAccesorios();
  }, []);

  const fetchPerfiles = async () => {
    try {
      const res = await fetch(`${API_URL}/perfiles`);
      const data = await res.json();
      setPerfiles(Array.isArray(data) ? data : []);
    } catch {
      setPerfiles([]);
    }
  };

  const fetchVidrios = async () => {
    try {
      const res = await fetch(`${API_URL}/vidrios`);
      const data = await res.json();
      setVidrios(Array.isArray(data) ? data : []);
    } catch {
      setVidrios([]);
    }
  };

  const fetchCamaras = async () => {
    try {
      const res = await fetch(`${API_URL}/camaras`);
      const data = await res.json();
      setCamaras(Array.isArray(data) ? data : []);
    } catch {
      setCamaras([]);
    }
  };

  const fetchAccesorios = async () => {
    try {
      const res = await fetch(`${API_URL}/accesorios`);
      const data = await res.json();
      setAccesorios(Array.isArray(data) ? data : []);
    } catch {
      setAccesorios([]);
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

  const handleAgregarCamara = async () => {
    await fetch(`${API_URL}/camaras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaCamara),
    });
    fetchCamaras();
    setModalCamarasOpen(false);
  };

  const handleAgregarAccesorio = async () => {
    await fetch(`${API_URL}/accesorios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoAccesorio),
    });
    fetchAccesorios();
    setModalAccesoriosOpen(false);
  };

  const handleArchivo = (setter) => (e) => setter(e.target.files[0]);

  const subirArchivo = async (tipo) => {
    const archivos = {
      perfiles: archivoPerfiles,
      vidrios: archivoVidrios,
      camaras: archivoCamaras,
      accesorios: archivoAccesorios,
    };

    if (!archivos[tipo]) {
      alert("Selecciona un archivo antes de subirlo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", archivos[tipo]);

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
      fetchCamaras();
      fetchAccesorios();
    } catch {
      setMensaje("Error al importar datos");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Base de Datos General</h1>

      <nav style={{ fontSize: "1.2rem", fontWeight: "bold", color: "gray", display: "flex", gap: "40px", marginBottom: "20px" }}>
        <div style={{ cursor: "pointer" }} onClick={() => setTab("perfiles")}>Perfiles</div>
        <div style={{ cursor: "pointer" }} onClick={() => setTab("vidrios")}>Vidrios</div>
        <div style={{ cursor: "pointer" }} onClick={() => setTab("camaras")}>Cámaras</div>
        <div style={{ cursor: "pointer" }} onClick={() => setTab("accesorios")}>Accesorios</div>
      </nav>

      {tab === "perfiles" && (
        <div>
          <Button onClick={() => setModalPerfilesOpen(true)}>+ Agregar Perfil</Button>
          <Button onClick={() => setModalImportarOpen(true)}>Importar Excel</Button>
          <ul>
            {perfiles.map((p) => (
              <li key={p._id}>{p.codigo} - {p.descripcion} - {p.extrusora}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "vidrios" && (
        <div>
          <Button onClick={() => setModalVidriosOpen(true)}>+ Agregar Vidrio</Button>
          <Button onClick={() => setModalImportarOpen("vidrios")}>Importar Excel</Button>
          <ul>
            {vidrios.map((v) => (
              <li key={v._id}>{v.descripcion} - {v.espesor} mm</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "camaras" && (
        <div>
          <Button onClick={() => setModalCamarasOpen(true)}>+ Agregar Cámara</Button>
          <Button onClick={() => setModalImportarOpen("camaras")}>Importar Excel</Button>
          <ul>
            {camaras.map((c) => (
              <li key={c._id}>{c.descripcion} - {c.espesor} mm</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "accesorios" && (
        <div>
          <Button onClick={() => setModalAccesoriosOpen(true)}>+ Agregar Accesorio</Button>
          <Button onClick={() => setModalImportarOpen("accesorios")}>Importar Excel</Button>
          <ul>
            {accesorios.map((a) => (
              <li key={a._id}>{a.codigo} - {a.descripcion} - {a.color} - {a.tipo}</li>
            ))}
          </ul>
        </div>
      )}

      {/* MODALES */}
      {modalPerfilesOpen && (
        <ModalBase onClose={() => setModalPerfilesOpen(false)} title="Agregar Perfil">
          <input type="text" placeholder="Código" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, codigo: e.target.value })} />
          <input type="text" placeholder="Descripción" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, descripcion: e.target.value })} />
          <select onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, extrusora: e.target.value })}>
            <option value="">Extrusora</option>
            {["Aluar", "Hydro", "Alcemar", "Aluwind", "Flamia MDT", "Rehau", "Munchtek", "Aluplast", "Veratek", "Veka", "Otro"].map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
          <input type="text" placeholder="Línea" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, linea: e.target.value })} />
          <input type="number" placeholder="Largo (mm)" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, largo: Number(e.target.value) })} />
          <input type="number" step="0.01" placeholder="Peso x metro (kg/m)" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, pesoxmetro: Number(e.target.value) })} />
          <Button onClick={handleAgregarPerfil}>Guardar</Button>
        </ModalBase>
      )}

      {modalVidriosOpen && (
        <ModalBase onClose={() => setModalVidriosOpen(false)} title="Agregar Vidrio">
          <input type="text" placeholder="Descripción" onChange={(e) => setNuevoVidrio({ ...nuevoVidrio, descripcion: e.target.value })} />
          <input type="number" placeholder="Espesor (mm)" onChange={(e) => setNuevoVidrio({ ...nuevoVidrio, espesor: Number(e.target.value) })} />
          <Button onClick={handleAgregarVidrio}>Guardar</Button>
        </ModalBase>
      )}

      {modalCamarasOpen && (
        <ModalBase onClose={() => setModalCamarasOpen(false)} title="Agregar Cámara">
          <input type="text" placeholder="Descripción" onChange={(e) => setNuevaCamara({ ...nuevaCamara, descripcion: e.target.value })} />
          <input type="number" placeholder="Espesor (mm)" onChange={(e) => setNuevaCamara({ ...nuevaCamara, espesor: Number(e.target.value) })} />
          <Button onClick={handleAgregarCamara}>Guardar</Button>
        </ModalBase>
      )}

      {modalAccesoriosOpen && (
        <ModalBase onClose={() => setModalAccesoriosOpen(false)} title="Agregar Accesorio">
          <input type="text" placeholder="Código" onChange={(e) => setNuevoAccesorio({ ...nuevoAccesorio, codigo: e.target.value })} />
          <input type="text" placeholder="Descripción" onChange={(e) => setNuevoAccesorio({ ...nuevoAccesorio, descripcion: e.target.value })} />
          <input type="text" placeholder="Color" onChange={(e) => setNuevoAccesorio({ ...nuevoAccesorio, color: e.target.value })} />
          <input type="number" placeholder="Cantidad" onChange={(e) => setNuevoAccesorio({ ...nuevoAccesorio, cantidad: Number(e.target.value) })} />
          <input type="text" placeholder="Unidad" value={nuevoAccesorio.unidad} onChange={(e) => setNuevoAccesorio({ ...nuevoAccesorio, unidad: e.target.value })} />
          <select onChange={(e) => setNuevoAccesorio({ ...nuevoAccesorio, tipo: e.target.value })}>
            <option value="">Selecciona tipo</option>
            {["accesorios", "herrajes", "tornillos", "bulones", "felpas", "selladores / espuma", "otro"].map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </select>
          <Button onClick={handleAgregarAccesorio}>Guardar</Button>
        </ModalBase>
      )}

      {modalImportarOpen && (
        <ModalBase onClose={() => setModalImportarOpen(false)} title="Importar Excel">
          <h4>Importar Perfiles</h4>
          <input type="file" accept=".xlsx" onChange={handleArchivo(setArchivoPerfiles)} />
          <Button onClick={() => subirArchivo("perfiles")}>Subir</Button>

          <h4>Importar Vidrios</h4>
          <input type="file" accept=".xlsx" onChange={handleArchivo(setArchivoVidrios)} />
          <Button onClick={() => subirArchivo("vidrios")}>Subir</Button>

          <h4>Importar Cámaras</h4>
          <input type="file" accept=".xlsx" onChange={handleArchivo(setArchivoCamaras)} />
          <Button onClick={() => subirArchivo("camaras")}>Subir</Button>

          <h4>Importar Accesorios</h4>
          <input type="file" accept=".xlsx" onChange={handleArchivo(setArchivoAccesorios)} />
          <Button onClick={() => subirArchivo("accesorios")}>Subir</Button>
        </ModalBase>
      )}

      {mensaje && <p className={styles.message}>{mensaje}</p>}
    </div>
  );
};

export default BaseMateriales;
