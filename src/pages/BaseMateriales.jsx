import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase";
import styles from "../styles/pages/BaseMateriales.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/general";

const BaseMateriales = () => {
  const [tab, setTab] = useState("perfiles"); // "perfiles" o "vidrios"
  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [nuevoPerfil, setNuevoPerfil] = useState({ descripcion: "", extrusora: "" });
  const [nuevoVidrio, setNuevoVidrio] = useState({ descripcion: "", espesor: "" });

  // Estados para archivos Excel
  const [archivoPerfiles, setArchivoPerfiles] = useState(null);
  const [archivoVidrios, setArchivoVidrios] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // Estados para los modales
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
    if ((tipo === "perfiles" && !archivoPerfiles) || (tipo === "vidrios" && !archivoVidrios)) {
      alert("Selecciona un archivo antes de subirlo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", tipo === "perfiles" ? archivoPerfiles : archivoVidrios);

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
    <div className={styles.container}>
      <h2>Base de Datos General</h2>

      <div className={styles.tabs}>
        <button className={tab === "perfiles" ? styles.activeTab : ""} onClick={() => setTab("perfiles")}>
          Perfiles
        </button>
        <button className={tab === "vidrios" ? styles.activeTab : ""} onClick={() => setTab("vidrios")}>
          Vidrios
        </button>
      </div>

      {tab === "perfiles" && (
        <div className={styles.content}>
          <button className={styles.addButton} onClick={() => setModalPerfilesOpen(true)}>+ Agregar Perfil</button>
          <button className={styles.importButton} onClick={() => setModalImportarOpen(true)}>📂 Importar Excel</button>

          <ul>
            {perfiles.map((p) => (
              <li key={p._id}>{p.descripcion} - {p.extrusora}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "vidrios" && (
        <div className={styles.content}>
          <button className={styles.addButton} onClick={() => setModalVidriosOpen(true)}>+ Agregar Vidrio</button>
          <button className={styles.importButton} onClick={() => setModalImportarOpen(true)}>📂 Importar Excel</button>

          <ul>
            {vidrios.map((v) => (
              <li key={v._id}>{v.descripcion} - {v.espesor} mm</li>
            ))}
          </ul>
        </div>
      )}

      {modalPerfilesOpen && (
        <ModalBase onClose={() => setModalPerfilesOpen(false)} title="Agregar Perfil">
          <input type="text" placeholder="Descripción" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, descripcion: e.target.value })} />
          <input type="text" placeholder="Extrusora" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, extrusora: e.target.value })} />
          <button onClick={handleAgregarPerfil}>Guardar</button>
        </ModalBase>
      )}

      {modalVidriosOpen && (
        <ModalBase onClose={() => setModalVidriosOpen(false)} title="Agregar Vidrio">
          <input type="text" placeholder="Descripción" onChange={(e) => setNuevoVidrio({ ...nuevoVidrio, descripcion: e.target.value })} />
          <input type="number" placeholder="Espesor (mm)" onChange={(e) => setNuevoVidrio({ ...nuevoVidrio, espesor: e.target.value })} />
          <button onClick={handleAgregarVidrio}>Guardar</button>
        </ModalBase>
      )}

      {modalImportarOpen && (
        <ModalBase onClose={() => setModalImportarOpen(false)} title="Importar Datos">
          <h3>Importar Perfiles</h3>
          <input type="file" accept=".xlsx" onChange={handleArchivoPerfiles} />
          <button onClick={() => subirArchivo("perfiles")}>Subir</button>

          <h3>Importar Vidrios</h3>
          <input type="file" accept=".xlsx" onChange={handleArchivoVidrios} />
          <button onClick={() => subirArchivo("vidrios")}>Subir</button>
        </ModalBase>
      )}

      {mensaje && <p className={styles.message}>{mensaje}</p>}
    </div>
  );
};

export default BaseMateriales;
