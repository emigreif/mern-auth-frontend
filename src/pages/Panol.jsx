// src/pages/Panol.jsx
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
  const [obras, setObras] = useState([]);

  const [data, setData] = useState({
    herramientas: [],
    perfiles: [],
    vidrios: [],
    accesorios: []
  });

  const [modals, setModals] = useState({
    herramienta: false,
    perfil: false,
    vidrio: false,
    accesorio: false,
    asignarPerfil: false,
    asignarAccesorio: false,
    asignarVidrio: false,
    asignarHerramienta: false,
    modalImportar: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchObras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setObras(data || []);
    } catch {
      console.error("Error al obtener obras");
    }
  };

  const fetchTipo = async (tipo) => {
    try {
      const res = await fetch(`${API_URL}/api/panol/${tipo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = await res.json();
      setData((prev) => ({ ...prev, [tipo]: list }));
    } catch {
      console.error(`❌ Error cargando ${tipo}`);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setErrorMsg("");
    await Promise.all(["herramientas", "perfiles", "vidrios", "accesorios"].map(fetchTipo));
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchAll();
      fetchObras();
    }
  }, [token]);

  const filteredList = Array.isArray(data[tab]) ? data[tab].filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  ) : [];

  const openModal = (type, item = null) => {
    setEditingItem(item);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeAllModals = () => {
    setEditingItem(null);
    const reset = {};
    Object.keys(modals).forEach((k) => (reset[k] = false));
    setModals(reset);
    fetchAll();
  };

  const renderFields = () => {
    switch (tab) {
      case "herramientas": return ["marca", "modelo", "estado"];
      case "perfiles":
      case "accesorios": return ["codigo", "descripcion", "color", "cantidad"];
      case "vidrios": return ["tipo", "ancho", "alto", "cantidad"];
      default: return [];
    }
  };

  const headers = renderFields().map((key) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  })).concat({ key: "acciones", label: "Acciones" });

  return (
    <div className={globalStyles.pageContainer}>
      <h1>Pañol</h1>
      {errorMsg && <p className={globalStyles.error}>{errorMsg}</p>}
      {loading && <p>Cargando datos...</p>}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "30px", marginBottom: 20 }}>
        {Object.keys(data).map((key) => (
          <div
            key={key}
            style={{
              cursor: "pointer",
              borderBottom: tab === key ? "2px solid black" : "none"
            }}
            onClick={() => setTab(key)}
          >
            {key.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <SearchBar value={search} onChange={setSearch} placeholder={`Buscar ${tab}`} />
        <Button onClick={() => setModals((m) => ({ ...m, modalImportar: true }))}>
          📥 Importar {tab}
        </Button>
        <Button
  onClick={() => {
    const modalMap = {
      herramientas: "herramienta",
      perfiles: "perfil",
      vidrios: "vidrio",
      accesorios: "accesorio",
    };
    openModal(modalMap[tab]);
  }}
>
  + Agregar
</Button>
        {tab !== "herramientas" && (
          <Button
            variant="secondary"
            onClick={() => {
              const map = {
                perfiles: "asignarPerfil",
                accesorios: "asignarAccesorio",
                vidrios: "asignarVidrio",
              };
              const modal = map[tab];
              if (modal) setModals((m) => ({ ...m, [modal]: true }));
            }}
          >
            ➡️ Asignar a Obra
          </Button>
        )}
      </div>

      {/* Tabla */}
      <Table headers={headers}>
        {filteredList.map((item) => (
          <tr key={item._id}>
            {renderFields().map((f) => <td key={f}>{item[f]}</td>)}
            <td><Button onClick={() => openModal(tab, item)}>✏️ Editar</Button></td>
          </tr>
        ))}
      </Table>

      {/* Modales dinámicos */}
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
      {modals.asignarPerfil && (
        <ModalAsignarPerfil
          isOpen
          perfiles={data.perfiles}
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
          accesorios={data.accesorios}
          obras={obras}
          token={token}
          API_URL={API_URL}
          onClose={closeAllModals}
          onSuccess={closeAllModals}
        />
      )}
      {modals.asignarVidrio && (
        <ModalAsignarVidrio
          isOpen
          vidrios={data.vidrios}
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
    </div>
  );
}
