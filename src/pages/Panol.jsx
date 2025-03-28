import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import globalStyles from "../styles/pages/GlobalStylePages.module.css";

// Modales base
import ModalHerramienta from "../components/modals/modalHerramienta.jsx";
import ModalPerfil from "../components/modals/modalPerfil.jsx";
import ModalVidrio from "../components/modals/modalVidrio.jsx";
import ModalAccesorio from "../components/modals/modalAccesorio.jsx";

// Nuevos modales de asignación
import ModalAsignarPerfil from "../components/modals/modalAsignarPerfil.jsx";
import ModalAsignarAccesorio from "../components/modals/modalAsignarAccesorio.jsx";
import ModalAsignarVidrio from "../components/modals/modalAsignarVidrio.jsx";

// Importamos el módulo de estilos exclusivo para Panol
import panolStyles from "../styles/pages/Panol.module.css";

export default function Panol() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [tab, setTab] = useState("herramientas");
  const [herramientas, setHerramientas] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
  const [obras, setObras] = useState([]);

  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const [modalHerramientaOpen, setModalHerramientaOpen] = useState(false);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [modalVidrioOpen, setModalVidrioOpen] = useState(false);
  const [modalAccesorioOpen, setModalAccesorioOpen] = useState(false);

  // Modales de asignación
  const [modalAsignarPerfilOpen, setModalAsignarPerfilOpen] = useState(false);
  const [modalAsignarAccesorioOpen, setModalAsignarAccesorioOpen] = useState(false);
  const [modalAsignarVidrioOpen, setModalAsignarVidrioOpen] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`${API_URL}/api/panol`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHerramientas(data.herramientas || []);
      setPerfiles(data.perfiles || []);
      setVidrios(data.vidrios || []);
      setAccesorios(data.accesorios || []);
    } catch (err) {
      setErrorMsg("Error al obtener datos del pañol");
    } finally {
      setLoading(false);
    }
  };

  const fetchObras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setObras(data || []);
    } catch (err) {
      console.error("Error al obtener obras", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
      fetchObras();
    }
  }, [token]);

  const filteredList = (list) =>
    list.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );

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

  const handleCloseAllModals = () => {
    setEditingItem(null);
    setModalHerramientaOpen(false);
    setModalPerfilOpen(false);
    setModalVidrioOpen(false);
    setModalAccesorioOpen(false);
    setModalAsignarPerfilOpen(false);
    setModalAsignarAccesorioOpen(false);
    setModalAsignarVidrioOpen(false);
    fetchData();
  };

  return (
    <div className={globalStyles.pageContainer}>
      <div className={globalStyles.header}>
        <h1>Pañol</h1>
      </div>

      {errorMsg && <p className={globalStyles.error}>{errorMsg}</p>}
      {loading && <p>Cargando datos...</p>}

      <div className={globalStyles.tabs}>
        {["herramientas", "perfiles", "vidrios", "accesorios"].map((t) => (
          <button
            key={t}
            className={`${globalStyles.tabBtn} ${tab === t ? globalStyles.active : ""}`}
            onClick={() => handleTabChange(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className={globalStyles.searchSection}>
        <input
          type="text"
          className={globalStyles.searchInput}
          placeholder={`Buscar ${tab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className={globalStyles.addBtn}
          onClick={() => handleOpenModal(tab)}
        >
          + Agregar {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>

        {tab !== "herramientas" && (
          <button
            className={globalStyles.secondaryBtn}
            onClick={() => {
              if (tab === "perfiles") setModalAsignarPerfilOpen(true);
              else if (tab === "accesorios") setModalAsignarAccesorioOpen(true);
              else if (tab === "vidrios") setModalAsignarVidrioOpen(true);
            }}
          >
            ➡️ Asignar a Obra
          </button>
        )}
      </div>

      <TableComponent
        data={
          tab === "herramientas"
            ? filteredList(herramientas)
            : tab === "perfiles"
            ? filteredList(perfiles)
            : tab === "vidrios"
            ? filteredList(vidrios)
            : filteredList(accesorios)
        }
        onEdit={(item) => handleOpenModal(tab, item)}
        fields={
          tab === "herramientas"
            ? ["marca", "modelo", "estado"]
            : tab === "perfiles"
            ? ["codigo", "descripcion", "color", "cantidad"]
            : tab === "vidrios"
            ? ["tipo", "ancho", "alto", "cantidad"]
            : ["codigo", "descripcion", "color", "cantidad"]
        }
      />

      {/* Modales para creación/edición */}
      {modalHerramientaOpen && (
        <ModalHerramienta
          herramienta={editingItem}
          onClose={handleCloseAllModals}
          onSaved={handleCloseAllModals}
        />
      )}
      {modalPerfilOpen && (
        <ModalPerfil
          isOpen={true}
          perfilData={editingItem}
          onClose={handleCloseAllModals}
          onSave={handleCloseAllModals}
        />
      )}
      {modalVidrioOpen && (
        <ModalVidrio
          isOpen={true}
          vidrioData={editingItem}
          onClose={handleCloseAllModals}
          onSave={handleCloseAllModals}
        />
      )}
      {modalAccesorioOpen && (
        <ModalAccesorio
          isOpen={true}
          accesorioData={editingItem}
          onClose={handleCloseAllModals}
          onSave={handleCloseAllModals}
        />
      )}

      {/* Modales de asignación a Obra */}
      {modalAsignarPerfilOpen && (
        <ModalAsignarPerfil
          isOpen={modalAsignarPerfilOpen}
          onClose={handleCloseAllModals}
          perfiles={perfiles}
          obras={obras}
          token={token}
          API_URL={API_URL}
          onSuccess={handleCloseAllModals}
        />
      )}
      {modalAsignarAccesorioOpen && (
        <ModalAsignarAccesorio
          isOpen={modalAsignarAccesorioOpen}
          onClose={handleCloseAllModals}
          accesorios={accesorios}
          obras={obras}
          token={token}
          API_URL={API_URL}
          onSuccess={handleCloseAllModals}
        />
      )}
      {modalAsignarVidrioOpen && (
        <ModalAsignarVidrio
          isOpen={modalAsignarVidrioOpen}
          onClose={handleCloseAllModals}
          vidrios={vidrios}
          obras={obras}
          token={token}
          API_URL={API_URL}
          onSuccess={handleCloseAllModals}
        />
      )}
    </div>
  );
}

const TableComponent = ({ data, fields, onEdit }) => {
  return (
    <>
      {data.length === 0 ? (
        <div className={panolStyles.noData}>No hay datos para mostrar</div>
      ) : (
        <table className={panolStyles.tableBase}>
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field}>{field.toUpperCase()}</th>
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
