import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/Panol.module.css";

import ModalHerramienta from "../components/ModalHerramienta.jsx";
import ModalPerfil from "../components/ModalPerfil.jsx";
import ModalVidrio from "../components/ModalVidrio.jsx";
import ModalAccesorio from "../components/ModalAccesorio.jsx";
import ModalAsignarHerramienta from "../components/ModalAsignarHerramienta.jsx";

const Panol = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [tab, setTab] = useState("herramientas");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [herramientas, setHerramientas] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [accesorios, setAccesorios] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState(""); // "herramienta", "perfil", etc.

  // Modal de asignar herramienta
  const [isAsignarOpen, setIsAsignarOpen] = useState(false);
  const [herramientaAsignarId, setHerramientaAsignarId] = useState(null);

  useEffect(() => {
    if (token) fetchData();
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
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = (list) =>
    list.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setModalType("");
    fetchData();
  };

  const handleSave = async (data) => {
    const endpointMap = {
      herramienta: "herramientas",
      perfil: "perfiles",
      vidrio: "vidrios",
      accesorio: "accesorios"
    };

    const endpoint = endpointMap[modalType];
    if (!endpoint) return;

    const isEdit = editingItem?._id;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${API_URL}/api/panol/${endpoint}/${editingItem._id}`
      : `${API_URL}/api/panol/${endpoint}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar");
      }
      closeModal();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const renderTable = (data, fields, type) => (
    <>
      {data.length === 0 ? (
        <div className={styles.noData}>No hay datos para mostrar</div>
      ) : (
        <table className={styles.tableBase}>
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field}>{field}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredList(data).map((item) => (
              <tr key={item._id}>
                {fields.map((field) => (
                  <td key={field}>{item[field]}</td>
                ))}
                <td>
                  <button onClick={() => openModal(type, item)}>✏️ Editar</button>
                  {type === "herramienta" && (
                    <button
                      style={{ marginLeft: "0.5rem" }}
                      onClick={() => {
                        setHerramientaAsignarId(item._id);
                        setIsAsignarOpen(true);
                      }}
                    >
                      🧰 Asignar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
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
            onClick={() => {
              setTab(t);
              setSearch("");
            }}
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
        <button className={styles.addBtn} onClick={() => openModal(tab)}>
          + Agregar {tab.slice(0, -1)}
        </button>
      </div>

      {tab === "herramientas" &&
        renderTable(herramientas, ["marca", "modelo", "estado"], "herramienta")}
      {tab === "perfiles" &&
        renderTable(perfiles, ["codigo", "descripcion", "color", "cantidad"], "perfil")}
      {tab === "vidrios" &&
        renderTable(vidrios, ["descripcion", "tipo", "ancho", "alto", "cantidad"], "vidrio")}
      {tab === "accesorios" &&
        renderTable(accesorios, ["descripcion", "tipo", "color", "cantidad", "unidad"], "accesorio")}

      {/* === Modales === */}
      {modalType === "herramienta" && (
        <ModalHerramienta
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          herramienta={editingItem}
        />
      )}
      {modalType === "perfil" && (
        <ModalPerfil
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          perfilData={editingItem}
        />
      )}
      {modalType === "vidrio" && (
        <ModalVidrio
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          vidrioData={editingItem}
        />
      )}
      {modalType === "accesorio" && (
        <ModalAccesorio
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          accesorioData={editingItem}
        />
      )}

      {/* Modal de asignación */}
      {isAsignarOpen && (
        <ModalAsignarHerramienta
          isOpen={isAsignarOpen}
          onClose={() => setIsAsignarOpen(false)}
          herramientaId={herramientaAsignarId}
          token={token}
          API_URL={API_URL}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default Panol;
