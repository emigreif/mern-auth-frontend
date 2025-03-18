// src/pages/Panol.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Panol.module.css";

// Se asume que existen modales para crear/editar: 
//   ModalHerramienta, ModalPerfil (de Pañol, no confundir con “perfiles” de usuario), 
//   ModalVidrio, ModalAccesorio
// O un único modal con diferentes formularios, etc.
import ModalHerramienta from "../../components/ModalHerramienta/ModalHerramienta.jsx";
import ModalPerfil from "../../components/ModalPerfil/ModalPerfil.jsx"; // Este "Perfil" se refiere a "perfiles" de Pañol
import ModalVidrio from "../../components/ModalVidrio/ModalVidrio.jsx";
import ModalAccesorio from "../../components/ModalAccesorio/ModalAccesorio.jsx";

/**
 * Página "Pañol"
 * - Pestañas: "herramientas", "perfiles", "vidrios", "accesorios"
 * - GET /api/panol/herramientas => setHerramientas
 *   ...
 * - Muestra spinner, error, no data
 */
const Panol = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Pestaña actual
  const [tab, setTab] = useState("herramientas");

  // Listas
  const [herramientas, setHerramientas] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [accesorios, setAccesorios] = useState([]);

  // Búsquedas
  const [searchHerr, setSearchHerr] = useState("");
  const [searchPerf, setSearchPerf] = useState("");
  const [searchVid, setSearchVid] = useState("");
  const [searchAcc, setSearchAcc] = useState("");

  // Modales
  const [modalHerrOpen, setModalHerrOpen] = useState(false);
  const [modalPerfOpen, setModalPerfOpen] = useState(false);
  const [modalVidOpen, setModalVidOpen] = useState(false);
  const [modalAccOpen, setModalAccOpen] = useState(false);

  // Error, spinner, success
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchHerramientas();
      fetchPerfiles();
      fetchVidrios();
      fetchAccesorios();
    }
  }, [token]);

  // Llamadas a backend
  const fetchHerramientas = async () => {
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/panol/herramientas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener herramientas");
      const data = await res.json();
      setHerramientas(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const fetchPerfiles = async () => {
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/panol/perfiles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener perfiles");
      const data = await res.json();
      setPerfiles(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const fetchVidrios = async () => {
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/panol/vidrios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener vidrios");
      const data = await res.json();
      setVidrios(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const fetchAccesorios = async () => {
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/panol/accesorios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener accesorios");
      const data = await res.json();
      setAccesorios(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Filtro
  const filteredHerr = herramientas.filter((h) =>
    (h.descripcion + h.marca + h.modelo).toLowerCase().includes(searchHerr.toLowerCase())
  );
  const filteredPerf = perfiles.filter((p) =>
    (p.codigo + p.descripcion).toLowerCase().includes(searchPerf.toLowerCase())
  );
  const filteredVid = vidrios.filter((v) =>
    (v.codigo + v.descripcion).toLowerCase().includes(searchVid.toLowerCase())
  );
  const filteredAcc = accesorios.filter((a) =>
    (a.codigo + a.descripcion).toLowerCase().includes(searchAcc.toLowerCase())
  );

  const handleTabChange = (t) => {
    setTab(t);
    setErrorMsg("");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Pañol</h1>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${tab === "herramientas" ? styles.active : ""}`}
          onClick={() => handleTabChange("herramientas")}
        >
          Herramientas
        </button>
        <button
          className={`${styles.tabBtn} ${tab === "perfiles" ? styles.active : ""}`}
          onClick={() => handleTabChange("perfiles")}
        >
          Perfiles
        </button>
        <button
          className={`${styles.tabBtn} ${tab === "vidrios" ? styles.active : ""}`}
          onClick={() => handleTabChange("vidrios")}
        >
          Vidrios
        </button>
        <button
          className={`${styles.tabBtn} ${tab === "accesorios" ? styles.active : ""}`}
          onClick={() => handleTabChange("accesorios")}
        >
          Accesorios
        </button>
      </div>

      {/* Sección según la pestaña */}
      {tab === "herramientas" && (
        <>
          <div className={styles.searchSection}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar herramienta..."
              value={searchHerr}
              onChange={(e) => setSearchHerr(e.target.value)}
            />
            <button className={styles.addBtn} onClick={() => setModalHerrOpen(true)}>
              + Agregar Herramienta
            </button>
          </div>
          {filteredHerr.length === 0 && (
            <div className={styles.noData}>No hay herramientas para mostrar</div>
          )}
          {filteredHerr.length > 0 && (
            <table className={styles.tableBase}>
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Descripción</th>
                  <th>N° Serie</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredHerr.map((h) => (
                  <tr key={h._id}>
                    <td>{h.marca}</td>
                    <td>{h.modelo}</td>
                    <td>{h.descripcion}</td>
                    <td>{h.numeroSerie}</td>
                    <td>{h.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === "perfiles" && (
        <>
          <div className={styles.searchSection}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar perfil..."
              value={searchPerf}
              onChange={(e) => setSearchPerf(e.target.value)}
            />
            <button className={styles.addBtn} onClick={() => setModalPerfOpen(true)}>
              + Agregar Perfil
            </button>
          </div>
          {filteredPerf.length === 0 && (
            <div className={styles.noData}>No hay perfiles para mostrar</div>
          )}
          {filteredPerf.length > 0 && (
            <table className={styles.tableBase}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Tratamiento</th>
                  <th>Largo</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerf.map((p) => (
                  <tr key={p._id}>
                    <td>{p.codigo}</td>
                    <td>{p.descripcion}</td>
                    <td>{p.tratamiento}</td>
                    <td>{p.largo}</td>
                    <td>{p.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === "vidrios" && (
        <>
          <div className={styles.searchSection}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar vidrio..."
              value={searchVid}
              onChange={(e) => setSearchVid(e.target.value)}
            />
            <button className={styles.addBtn} onClick={() => setModalVidOpen(true)}>
              + Agregar Vidrio
            </button>
          </div>
          {filteredVid.length === 0 && (
            <div className={styles.noData}>No hay vidrios para mostrar</div>
          )}
          {filteredVid.length > 0 && (
            <table className={styles.tableBase}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Tipo</th>
                  <th>Ancho</th>
                  <th>Alto</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {filteredVid.map((v) => (
                  <tr key={v._id}>
                    <td>{v.codigo}</td>
                    <td>{v.descripcion}</td>
                    <td>{v.tipo}</td>
                    <td>{v.ancho}</td>
                    <td>{v.alto}</td>
                    <td>{v.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === "accesorios" && (
        <>
          <div className={styles.searchSection}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar accesorio..."
              value={searchAcc}
              onChange={(e) => setSearchAcc(e.target.value)}
            />
            <button className={styles.addBtn} onClick={() => setModalAccOpen(true)}>
              + Agregar Accesorio
            </button>
          </div>
          {filteredAcc.length === 0 && (
            <div className={styles.noData}>No hay accesorios para mostrar</div>
          )}
          {filteredAcc.length > 0 && (
            <table className={styles.tableBase}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Color</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                </tr>
              </thead>
              <tbody>
                {filteredAcc.map((a) => (
                  <tr key={a._id}>
                    <td>{a.codigo}</td>
                    <td>{a.descripcion}</td>
                    <td>{a.color}</td>
                    <td>{a.cantidad}</td>
                    <td>{a.unidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Modales para agregar */}
      {modalHerrOpen && (
        <ModalHerramienta onClose={() => setModalHerrOpen(false)} />
      )}
      {modalPerfOpen && (
        <ModalPerfil onClose={() => setModalPerfOpen(false)} />
      )}
      {modalVidOpen && (
        <ModalVidrio onClose={() => setModalVidOpen(false)} />
      )}
      {modalAccOpen && (
        <ModalAccesorio onClose={() => setModalAccOpen(false)} />
      )}
    </div>
  );
};

export default Panol;
