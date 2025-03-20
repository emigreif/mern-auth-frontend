import React, { useState, useEffect } from "react";
import ModalBase from "../../components/ModalBase/ModalBase";
import styles from "./BaseMateriales.module.css"; // ✅ Corrige el error de importación

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BaseMateriales = () => {
  const [tab, setTab] = useState("perfiles"); // "perfiles" o "vidrios"
  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  
  const [nuevoPerfil, setNuevoPerfil] = useState({ descripcion: "", extrusora: "", largo: "", pesoxmetro: "" });
  const [nuevoVidrio, setNuevoVidrio] = useState({ descripcion: "", espesor: "", peso_m2: "" });

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
    const res = await fetch(`${API_URL}/perfiles`);
    const data = await res.json();
    setPerfiles(data);
  };

  const fetchVidrios = async () => {
    const res = await fetch(`${API_URL}/vidrios`);
    const data = await res.json();
    setVidrios(data);
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

      {/* Sección de perfiles */}
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

      {/* Sección de vidrios */}
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

      {/* Modal para agregar Perfil */}
      {modalPerfilesOpen && (
        <ModalBase isOpen={modalPerfilesOpen} onClose={() => setModalPerfilesOpen(false)} title="Agregar Perfil">
          <input type="text" placeholder="Descripción" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, descripcion: e.target.value })} />
          <input type="text" placeholder="Extrusora" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, extrusora: e.target.value })} />
          <input type="number" placeholder="Largo (mm)" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, largo: e.target.value })} />
          <input type="number" placeholder="Peso (kg/m)" onChange={(e) => setNuevoPerfil({ ...nuevoPerfil, pesoxmetro: e.target.value })} />
          <button onClick={handleAgregarPerfil}>Guardar</button>
        </ModalBase>
      )}

      {/* Modal para agregar Vidrio */}
      {modalVidriosOpen && (
        <ModalBase isOpen={modalVidriosOpen} onClose={() => setModalVidriosOpen(false)} title="Agregar Vidrio">
          <input type="text" placeholder="Descripción" onChange={(e) => setNuevoVidrio({ ...nuevoVidrio, descripcion: e.target.value })} />
          <input type="number" placeholder="Espesor (mm)" onChange={(e) => setNuevoVidrio({ ...nuevoVidrio, espesor: e.target.value })} />
          <button onClick={handleAgregarVidrio}>Guardar</button>
        </ModalBase>
      )}

      {/* Modal para importar Excel */}
      {modalImportarOpen && (
        <ModalBase isOpen={modalImportarOpen} onClose={() => setModalImportarOpen(false)} title="Importar Datos">
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
