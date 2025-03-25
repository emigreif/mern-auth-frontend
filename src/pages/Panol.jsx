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
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [modals, setModals] = useState({
    herramienta: false,
    perfil: false,
    vidrio: false,
    accesorio: false,
  });

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/panol`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHerramientas(data.herramientas || []);
      setPerfiles(data.perfiles || []);
      setVidrios(data.vidrios || []);
      setAccesorios(data.accesorios || []);
    } catch (err) {
      setErrorMsg("Error al cargar el pañol");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    setEditingItem(item);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModals = () => {
    setModals({ herramienta: false, perfil: false, vidrio: false, accesorio: false });
    setEditingItem(null);
    fetchData();
  };

  const handleGuardar = async (tipo, data) => {
    const isEdit = !!editingItem;
    const id = editingItem?._id;
    const endpoint = `/api/panol/${tipo}${isEdit ? `/${id}` : ""}`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar");
      }

      closeModals();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (tipo, id) => {
    if (!confirm("¿Eliminar elemento?")) return;

    try {
      const res = await fetch(`${API_URL}/api/panol/${tipo}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar");

      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = (items) =>
    items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );

  const renderTable = (items, fields, tipo) => (
    <>
      {filtered(items).length === 0 ? (
        <p>No hay elementos</p>
      ) : (
        <table className={styles.tableBase}>
          <thead>
            <tr>
              {fields.map((f) => (
                <th key={f}>{f}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered(items).map((item) => (
              <tr key={item._id}>
                {fields.map((f) => (
                  <td key={f}>{item[f]}</td>
                ))}
                <td>
                  <button onClick={() => openModal(tipo, item)}>✏️</button>
                  <button onClick={() => handleDelete(tipo, item._id)}>🗑️</button>
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
      <h1>Pañol</h1>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <p>Cargando...</p>}

      <div className={styles.tabs}>
        {["herramienta", "perfil", "vidrio", "accesorio"].map((t) => (
          <button
            key={t}
            className={`${styles.tabBtn} ${tab === t + "s" ? styles.active : ""}`}
            onClick={() => setTab(t + "s")}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}s
          </button>
        ))}
      </div>

      <div className={styles.searchSection}>
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal(tab.slice(0, -1))}>
          + Agregar {tab.slice(0, -1)}
        </button>
      </div>

      {tab === "herramientas" &&
        renderTable(herramientas, ["marca", "modelo", "estado"], "herramientas")}

      {tab === "perfiles" &&
        renderTable(perfiles, ["codigo", "descripcion", "color"], "perfiles")}

{tab === "vidrios" &&
  renderTable(vidrios, ["descripcion", "tipo", "cantidad"], "vidrios")}

      {tab === "accesorios" &&
        renderTable(accesorios, ["codigo", "descripcion", "tipo"], "accesorios")}

      {/* Modales */}
      {modals.herramienta && (
        <ModalHerramienta
          isOpen={modals.herramienta}
          onClose={closeModals}
          herramienta={editingItem}
          onSave={(data) => handleGuardar("herramientas", data)}
        />
      )}
      {modals.perfil && (
        <ModalPerfil
          isOpen={modals.perfil}
          onClose={closeModals}
          perfilData={editingItem}
          onSave={(data) => handleGuardar("perfiles", data)}
        />
      )}
      {modals.vidrio && (
        <ModalVidrio
          isOpen={modals.vidrio}
          onClose={closeModals}
          vidrioData={editingItem}
          onSave={(data) => handleGuardar("vidrios", data)}
        />
      )}
      {modals.accesorio && (
        <ModalAccesorio
          isOpen={modals.accesorio}
          onClose={closeModals}
          accesorioData={editingItem}
          onSave={(data) => handleGuardar("accesorios", data)}
        />
      )}
    </div>
  );
};

export default Panol;
