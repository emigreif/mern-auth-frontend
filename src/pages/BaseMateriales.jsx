// src/pages/BaseMateriales.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/modals/ModalBase";
import Button from "../components/ui/Button.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/general";

const BaseMateriales = () => {
  const [tab, setTab] = useState("perfiles"); // "perfiles" o "vidrios"
  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [nuevoPerfil, setNuevoPerfil] = useState({ descripcion: "", extrusora: "" });
  const [nuevoVidrio, setNuevoVidrio] = useState({ descripcion: "", espesor: "" });
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
    <div className={styles.pageContainer}>
      <h2>Base de Datos General</h2>
      <div className={styles.tabs}>
        <Button onClick={() => setTab("perfiles")} className={tab === "perfiles" ? styles.activeTab : ""}>
          Perfiles
        </Button>
        <Button onClick={() => setTab("vidrios")} className={tab === "vidrios" ? styles.activeTab : ""}>
          Vidrios
        </Button>
      </div>

      {tab === "perfiles" && (
        <div className={styles.content}>
          <Button onClick={() => setModalPerfilesOpen(true)} className={styles.addButton}>
            + Agregar Perfil
          </Button>
          <Button onClick={() => setModalImportarOpen(true)} className={styles.importButton}>
            📂 Importar Excel
          </Button>
          <ul>
            {perfiles.map((p) => (
              <li key={p._id}>{p.descripcion} - {p.extrusora}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "vidrios" && (
        <div className={styles.content}>
          <Button onClick={() => setModalVidriosOpen(true)} className={styles.addButton}>
            + Agregar Vidrio
          </Button>
          <Button onClick={() => setModalImportarOpen(true)} className={styles.importButton}>
            📂 Importar Excel
          </Button>
          <ul>
            {vidrios.map((v) => (
              <li key={v._id}>{v.descripcion} - {v.espesor} mm</li>
            ))}
          </ul>
        </div>
      )}

      {modalPerfilesOpen && (
        <ModalBase onClose={() => setModalPerfilesOpen(false)} title="Agregar Perfil">
          <input
            type="text"
            placeholder="Descripción"
            onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, descripcion: e.target.value })}
          />
          <input
            type="text"
            placeholder="Extrusora"
            onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, extrusora: e.target.value })}
          />
          <Button onClick={handleAgregarPerfil}>Guardar</Button>
        </ModalBase>
      )}

      {modalVidriosOpen && (
        <ModalBase onClose={() => setModalVidriosOpen(false)} title="Agregar Vidrio">
          <input
            type="text"
            placeholder="Descripción"
            onChange={(e) => setNuevoVidrio({ ...nuevoVidrio, descripcion: e.target.value })}
          />
          <input
            type="number"
            placeholder="Espesor (mm)"
            onChange={(e) => setNuevoVidrio({ ...nuevoVidrio, espesor: e.target.value })}
          />
          <Button onClick={handleAgregarVidrio}>Guardar</Button>
        </ModalBase>
      )}

      {modalImportarOpen && (
        <ModalBase onClose={() => setModalImportarOpen(false)} title="Importar Datos">
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
