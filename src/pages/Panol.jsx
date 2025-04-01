import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

// UI Components
import Button from "../components/ui/Button.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";
import Table from "../components/ui/Table.jsx";
import List from "../components/ui/List.jsx";

// Modales
import ModalAsignarPerfil from "../components/modals/ModalAsignarPerfil.jsx";
import ModalAsignarVidrio from "../components/modals/ModalAsignarVidrio.jsx";
import ModalAsignarAccesorio from "../components/modals/ModalAsignarAccesorio.jsx";
import ModalAsignarHerramienta from "../components/modals/ModalAsignarHerramienta.jsx";
import ModalIngresoMaterial from "../components/modals/ModalIngresoMaterial.jsx";

const Panol = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [materiales, setMateriales] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados de modales
  const [modalIngresoOpen, setModalIngresoOpen] = useState(false);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [modalVidrioOpen, setModalVidrioOpen] = useState(false);
  const [modalAccesorioOpen, setModalAccesorioOpen] = useState(false);
  const [modalHerramientaOpen, setModalHerramientaOpen] = useState(false);

  const fetchMateriales = async () => {
    try {
      const res = await fetch(`${API_URL}/api/materiales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMateriales(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error al cargar materiales", error);
    }
  };

  useEffect(() => {
    if (token) fetchMateriales();
  }, [token]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(materiales);
    } else {
      setFiltered(
        materiales.filter((mat) =>
          mat.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, materiales]);

  return (
    <div style={{ padding: "2rem", background: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <SearchBar
          placeholder="Buscar materiales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button onClick={() => setModalIngresoOpen(true)}>
            ➕ Ingreso de Material
          </Button>
          <Button onClick={() => setModalPerfilOpen(true)}>
            🧱 Asignar Perfil
          </Button>
          <Button onClick={() => setModalVidrioOpen(true)}>
            🪟 Asignar Vidrio
          </Button>
          <Button onClick={() => setModalAccesorioOpen(true)}>
            🔩 Asignar Accesorio
          </Button>
          <Button onClick={() => setModalHerramientaOpen(true)}>
            🛠️ Asignar Herramienta
          </Button>
        </div>
      </div>

      {/* Resultado */}
      {filtered.length === 0 ? (
        <List items={[]} emptyText="No hay materiales disponibles." />
      ) : (
        <Table
          headers={["Nombre", "Tipo", "Stock", "Unidad"]}
          data={filtered.map((mat) => [
            mat.nombre,
            mat.tipo,
            mat.stock,
            mat.unidad,
          ])}
        />
      )}

      {/* Modales */}
      {modalIngresoOpen && (
        <ModalIngresoMaterial
          isOpen={modalIngresoOpen}
          onClose={() => setModalIngresoOpen(false)}
          onSaved={fetchMateriales}
        />
      )}
      {modalPerfilOpen && (
        <ModalAsignarPerfil
          isOpen={modalPerfilOpen}
          onClose={() => setModalPerfilOpen(false)}
          onSave={fetchMateriales}
          token={token}
          API_URL={API_URL}
        />
      )}
      {modalVidrioOpen && (
        <ModalAsignarVidrio
          isOpen={modalVidrioOpen}
          onClose={() => setModalVidrioOpen(false)}
          onSave={fetchMateriales}
          token={token}
          API_URL={API_URL}
        />
      )}
      {modalAccesorioOpen && (
        <ModalAsignarAccesorio
          isOpen={modalAccesorioOpen}
          onClose={() => setModalAccesorioOpen(false)}
          onSave={fetchMateriales}
          token={token}
          API_URL={API_URL}
        />
      )}
      {modalHerramientaOpen && (
        <ModalAsignarHerramienta
          isOpen={modalHerramientaOpen}
          onClose={() => setModalHerramientaOpen(false)}
          onSave={fetchMateriales}
          token={token}
          API_URL={API_URL}
        />
      )}
    </div>
  );
};

export default Panol;
