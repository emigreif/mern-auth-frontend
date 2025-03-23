import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/Panol.module.css";

import ModalHerramienta from "../components/ModalHerramienta.jsx";
import ModalPerfil from "../components/ModalPerfil.jsx";
import ModalVidrio from "../components/ModalVidrio.jsx";
import ModalAccesorio from "../components/ModalAccesorio.jsx";

const Panol = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [tab, setTab] = useState("herramientas");

  const [herramientas, setHerramientas] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [accesorios, setAccesorios] = useState([]);

  const [search, setSearch] = useState("");

  // Estado para Modales
  const [modalHerramientaOpen, setModalHerramientaOpen] = useState(false);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [modalVidrioOpen, setModalVidrioOpen] = useState(false);
  const [modalAccesorioOpen, setModalAccesorioOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/panol`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener datos del pañol");
      const data = await res.json();
      setHerramientas(data.herramientas || []);
      setPerfiles(data.perfiles || []);
      setVidrios(data.vidrios || []);
      setAccesorios(data.accesorios || []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (t) => {
    setTab(t);
    setSearch("");
  };

  const handleOpenModal = (type, item = null) => {
    setEditingItem(item);
    switch (type) {
      case "herramienta":
        setModalHerramientaOpen(true);
        break;
      case "perfil":
        setModalPerfilOpen(true);
        break;
      case "vidrio":
        setModalVidrioOpen(true);
        break;
      case "accesorio":
        setModalAccesorioOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setModalHerramientaOpen(false);
    setModalPerfilOpen(false);
    setModalVidrioOpen(false);
    setModalAccesorioOpen(false);
    fetchData(); // Refrescar datos después de cerrar modal
  };

  const filteredList = (list) => list.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Pañol</h1>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <p>Cargando datos...</p>}

      <div className={styles.tabs}>
        {["herramientas", "perfiles", "vidrios", "accesorios"].map((t) => (
          <button
            key={t}
            className={`${styles.tabBtn} ${tab === t ? styles.active : ""}`}
            onClick={() => handleTabChange(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={`Buscar ${tab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className={styles.addBtn} onClick={() => handleOpenModal(tab)}>
          + Agregar {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      </div>

      {tab === "herramientas" && (
        <TableComponent data={filteredList(herramientas)} fields={["marca", "modelo", "estado"]} onEdit={(item) => handleOpenModal("herramienta", item)} />
      )}

      {tab === "perfiles" && (
        <TableComponent data={filteredList(perfiles)} fields={["codigo", "descripcion", "color"]} onEdit={(item) => handleOpenModal("perfil", item)} />
      )}

      {tab === "vidrios" && (
        <TableComponent data={filteredList(vidrios)} fields={["codigo", "descripcion", "tipo"]} onEdit={(item) => handleOpenModal("vidrio", item)} />
      )}

      {tab === "accesorios" && (
        <TableComponent data={filteredList(accesorios)} fields={["codigo", "descripcion", "tipo"]} onEdit={(item) => handleOpenModal("accesorio", item)} />
      )}

      {modalHerramientaOpen && <ModalHerramienta herramienta={editingItem} onClose={handleCloseModal} />}
      {modalPerfilOpen && <ModalPerfil perfil={editingItem} onClose={handleCloseModal} />}
      {modalVidrioOpen && <ModalVidrio vidrio={editingItem} onClose={handleCloseModal} />}
      {modalAccesorioOpen && <ModalAccesorio accesorio={editingItem} onClose={handleCloseModal} />}
    </div>
  );
};

const TableComponent = ({ data, fields, onEdit }) => {
  return (
    <>
      {data.length === 0 ? (
        <div className={styles.noData}>No hay datos para mostrar</div>
      ) : (
        <table className={styles.tableBase}>
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                {fields.map((field) => (
                  <td key={field}>{item[field]}</td>
                ))}
                <td>
                  <button onClick={() => onEdit(item)}>✏️ Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Panol;
