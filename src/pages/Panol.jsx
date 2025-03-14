// frontend/src/pages/Panol.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx"; // Si tienes AuthContext
import ModalHerramienta from "../components/ModalHerramienta.jsx";
import ModalPerfil from "../components/ModalPerfil.jsx";
import ModalVidrio from "../components/ModalVidrio.jsx";
import ModalAccesorio from "../components/ModalAccesorio.jsx";

export default function Panol() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Pestaña actual (puede ser "herramientas", "perfiles", "vidrios", "accesorios")
  const [tab, setTab] = useState("herramientas");

  // Listas
  const [herramientas, setHerramientas] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [accesorios, setAccesorios] = useState([]);

  // Búsqueda
  const [searchHerr, setSearchHerr] = useState("");
  const [searchPerf, setSearchPerf] = useState("");
  const [searchVid, setSearchVid] = useState("");
  const [searchAcc, setSearchAcc] = useState("");

  // Para mostrar/ocultar modales
  const [modalHerrOpen, setModalHerrOpen] = useState(false);
  const [modalPerfOpen, setModalPerfOpen] = useState(false);
  const [modalVidOpen, setModalVidOpen] = useState(false);
  const [modalAccOpen, setModalAccOpen] = useState(false);

  // Mensajes
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Cargar datos al montar
  useEffect(() => {
    if (token) {
      fetchHerramientas();
      fetchPerfiles();
      fetchVidrios();
      fetchAccesorios();
    }
  }, [token]);

  const fetchHerramientas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/panol/herramientas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener herramientas");
      const data = await res.json();
      setHerramientas(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const fetchPerfiles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/panol/perfiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener perfiles");
      const data = await res.json();
      setPerfiles(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const fetchVidrios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/panol/vidrios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener vidrios");
      const data = await res.json();
      setVidrios(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const fetchAccesorios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/panol/accesorios`, {
        headers: { Authorization: `Bearer ${token}` },
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
    (v.descripcion + (v.tipo || "")).toLowerCase().includes(searchVid.toLowerCase())
  );
  const filteredAcc = accesorios.filter((a) =>
    (a.codigo + a.descripcion).toLowerCase().includes(searchAcc.toLowerCase())
  );

  const handleTabChange = (t) => {
    setTab(t);
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div className="page-contenedor">
      <h1>Pañol</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      {/* Pestañas */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => handleTabChange("herramientas")}>Herramientas</button>
        <button onClick={() => handleTabChange("perfiles")}>Perfiles</button>
        <button onClick={() => handleTabChange("vidrios")}>Vidrios</button>
        <button onClick={() => handleTabChange("accesorios")}>Accesorios</button>
      </div>

      {/* Contenido según la pestaña */}
      {tab === "herramientas" && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Buscar herramienta..."
              value={searchHerr}
              onChange={(e) => setSearchHerr(e.target.value)}
            />
            <button onClick={() => setModalHerrOpen(true)}>+ Agregar Herramienta</button>
          </div>
          <table className="table-base">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Descripción</th>
                <th>N° Serie</th>
                <th>Estado</th>
                <th>Acciones</th>
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
                  <td>
                    {/* Ejemplo: Botón de Egreso/Ingreso */}
                    <button>Egreso</button>
                    <button>Ingreso</button>
                    <button>Dar de Baja</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "perfiles" && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Buscar perfil..."
              value={searchPerf}
              onChange={(e) => setSearchPerf(e.target.value)}
            />
            <button onClick={() => setModalPerfOpen(true)}>+ Agregar Perfil</button>
          </div>
          <table className="table-base">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Tratamiento</th>
                <th>Largo</th>
                <th>Cantidad</th>
                <th>Acciones</th>
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
                  <td>
                    {/* Ejemplo: Botón de Descontar Stock */}
                    <button>Descontar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "vidrios" && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Buscar vidrio..."
              value={searchVid}
              onChange={(e) => setSearchVid(e.target.value)}
            />
            <button onClick={() => setModalVidOpen(true)}>+ Agregar Vidrio</button>
          </div>
          <table className="table-base">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Ancho</th>
                <th>Alto</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredVid.map((v) => (
                <tr key={v._id}>
                  <td>{v.tipo}</td>
                  <td>{v.descripcion}</td>
                  <td>{v.ancho}</td>
                  <td>{v.alto}</td>
                  <td>{v.cantidad}</td>
                  <td>
                    <button>Descontar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "accesorios" && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Buscar accesorio..."
              value={searchAcc}
              onChange={(e) => setSearchAcc(e.target.value)}
            />
            <button onClick={() => setModalAccOpen(true)}>+ Agregar Accesorio</button>
          </div>
          <table className="table-base">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Unidad</th>
                <th>Acciones</th>
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
                  <td>
                    <button>Descontar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Modales */}
      {modalHerrOpen && <ModalHerramienta onClose={() => setModalHerrOpen(false)} />}
      {modalPerfOpen && <ModalPerfil onClose={() => setModalPerfOpen(false)} />}
      {modalVidOpen && <ModalVidrio onClose={() => setModalVidOpen(false)} />}
      {modalAccOpen && <ModalAccesorio onClose={() => setModalAccOpen(false)} />}
    </div>
  );
}
