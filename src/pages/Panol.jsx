import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

// Modales
import ModalHerramienta from "../components/modals/ModalHerramienta.jsx";
import ModalPerfil from "../components/modals/ModalPerfil.jsx";
import ModalVidrio from "../components/modals/ModalVidrio.jsx";
import ModalAccesorio from "../components/modals/ModalAccesorio.jsx";
import ModalImportarMaterial from "../components/modals/ModalImportarMaterial.jsx";
import ModalAsignarPerfil from "../components/modals/ModalAsignarPerfil.jsx";
import ModalAsignarAccesorio from "../components/modals/ModalAsignarAccesorio.jsx";
import ModalAsignarVidrio from "../components/modals/ModalAsignarVidrio.jsx";
import ModalAsignarHerramienta from "../components/modals/ModalAsignarHerramienta.jsx";

// UI
import Button from "../components/ui/Button.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";
import Table from "../components/ui/Table.jsx";

import globalStyles from "../styles/pages/GlobalStylePages.module.css";

export default function Panol() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [tab, setTab] = useState("herramientas");
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const [herramientas, setHerramientas] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [vidrios, setVidrios] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
  const [obras, setObras] = useState([]);

  const [modals, setModals] = useState({
    herramienta: false,
    perfil: false,
    vidrio: false,
    accesorio: false,
    asignarPerfil: false,
    asignarAccesorio: false,
    modalImportar: false,
    asignarVidrio: false,
    asignarHerramienta: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (token) {
      fetchData();
      fetchObras();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/panol`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHerramientas(data.herramientas || []);
      setPerfiles(data.perfiles || []);
      setVidrios(data.vidrios || []);
      setAccesorios(data.accesorios || []);
    } catch {
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
      setObras(await res.json());
    } catch {
      console.error("Error al obtener obras");
    }
  };

  const filteredList = (list) =>
    list.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );

  const openModal = (type, item = null) => {
    setEditingItem(item);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeAllModals = () => {
    setEditingItem(null);
    setModals({
      herramienta: false,
      perfil: false,
      vidrio: false,
      accesorio: false,
      asignarPerfil: false,
      asignarAccesorio: false,
      modalImportar: false,
      asignarVidrio: false,
      asignarHerramienta: false,
    });
    fetchData();
  };

  const renderTableData = () => {
    switch (tab) {
      case "herramientas":
        return filteredList(herramientas);
      case "perfiles":
        return filteredList(perfiles);
      case "vidrios":
        return filteredList(vidrios);
      case "accesorios":
        return filteredList(accesorios);
      default:
        return [];
    }
  };

  const renderFields = () => {
    switch (tab) {
      case "herramientas":
        return ["marca", "modelo", "estado"];
      case "perfiles":
      case "accesorios":
        return ["codigo", "descripcion", "color", "cantidad"];
      case "vidrios":
        return ["tipo", "ancho", "alto", "cantidad"];
      default:
        return [];
    }
  };

  const headers = renderFields().map((key) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  })).concat({ key: "acciones", label: "Acciones" });

  return (
    <div className={globalStyles.pageContainer}>
      <div className={globalStyles.header}>
        <h1>Pañol</h1>
      </div>

      {errorMsg && <p className={globalStyles.error}>{errorMsg}</p>}
      {loading && <p>Cargando datos...</p>}

      <div style={{ display: "flex", gap: "30px", fontWeight: "bold", marginBottom: "20px" }}>
        {["herramientas", "perfiles", "vidrios", "accesorios"].map((t) => (
          <div
            key={t}
            style={{
              cursor: "pointer",
              color: tab === t ? "black" : "gray",
              borderBottom: tab === t ? "2px solid black" : "2px solid transparent",
              paddingBottom: "5px",
            }}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <SearchBar value={search} onChange={setSearch} placeholder={`Buscar ${tab}...`} />
        <Button onClick={() => setModals({ ...modals, modalImportar: true })}>
          📥 Importar {tab}
        </Button>
        <Button onClick={() => {
          const modalMap = {
            herramientas: "herramienta",
            perfiles: "perfil",
            vidrios: "vidrio",
            accesorios: "accesorio",
          };
          openModal(modalMap[tab]);
        }}>
          + Agregar {tab}
        </Button>
        {tab !== "herramientas" && (
          <Button variant="secondary" onClick={() => {
            const asignarMap = {
              perfiles: "asignarPerfil",
              accesorios: "asignarAccesorio",
              vidrios: "asignarVidrio",
            };
            const modalKey = asignarMap[tab];
            if (modalKey) setModals({ ...modals, [modalKey]: true });
          }}>
            ➡️ Asignar a Obra
          </Button>
        )}
      </div>

      <Table headers={headers}>
        {renderTableData().map((item) => (
          <tr key={item._id}>
            {renderFields().map((field) => (
              <td key={field}>{item[field]}</td>
            ))}
            <td>
              <Button onClick={() => openModal(tab, item)}>✏️ Editar</Button>
            </td>
          </tr>
        ))}
      </Table>

      {/* Modales */}
      {modals.herramienta && (
        <ModalHerramienta
          herramienta={editingItem}
          onClose={closeAllModals}
          onSaved={closeAllModals}
        />
      )}
      {modals.perfil && (
        <ModalPerfil
          isOpen
          perfilData={editingItem}
          onClose={closeAllModals}
          onSave={closeAllModals}
        />
      )}
      {modals.vidrio && (
        <ModalVidrio
          isOpen
          vidrioData={editingItem}
          onClose={closeAllModals}
          onSave={closeAllModals}
        />
      )}
      {modals.accesorio && (
        <ModalAccesorio
          accesorio={editingItem}
          onClose={closeAllModals}
          onSaved={closeAllModals}
          token={token}
          apiUrl={API_URL}
        />
      )}
      {modals.asignarHerramienta && (
        <ModalAsignarHerramienta
          isOpen
          API_URL={API_URL}
          token={token}
          onClose={closeAllModals}
          onSave={closeAllModals}
        />
      )}
      {modals.asignarPerfil && (
        <ModalAsignarPerfil
          isOpen
          perfiles={perfiles}
          obras={obras}
          token={token}
          API_URL={API_URL}
          onClose={closeAllModals}
          onSuccess={closeAllModals}
        />
      )}
      {modals.asignarAccesorio && (
        <ModalAsignarAccesorio
          isOpen
          accesorios={accesorios}
          obras={obras}
          token={token}
          API_URL={API_URL}
          onClose={closeAllModals}
          onSuccess={closeAllModals}
        />
      )}
      {modals.modalImportar && (
        <ModalImportarMaterial
          isOpen
          tipo={tab}
          token={token}
          API_URL={API_URL}
          onClose={closeAllModals}
        />
      )}
      {modals.asignarVidrio && (
        <ModalAsignarVidrio
          isOpen
          vidrios={vidrios}
          obras={obras}
          token={token}
          API_URL={API_URL}
          onClose={closeAllModals}
          onSuccess={closeAllModals}
        />
      )}
    </div>
  );
}
