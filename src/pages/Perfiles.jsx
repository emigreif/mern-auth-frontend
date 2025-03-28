// src/pages/Perfiles.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import ModalProfile from "../components/modals/ModalProfile.jsx"; // ✅ tu nuevo modal
import styles from "../styles/pages/GlobalStylePages.module.css";

const Perfiles = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [perfilEdit, setPerfilEdit] = useState(null); // null = nuevo perfil

  useEffect(() => {
    if (token) fetchPerfiles();
  }, [token]);

  const fetchPerfiles = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/perfiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al listar perfiles");
      }
      const data = await res.json();
      setPerfiles(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este perfil?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_URL}/api/perfiles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al eliminar perfil");
      }
      setSuccessMsg("Perfil eliminado correctamente.");
      fetchPerfiles();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Gestión de perfiles</h1>
        <div
          style={{
            display: "flex",
            color: "gray",
            flexWrap: "wrap",
            gap: "50px",
          }}
        >
          <h3>
            <Link to="/profile">Mi Perfil</Link>
          </h3>
          <h3>
            <Link to="/configuracion">Configuración</Link>
          </h3>
        </div>
      </div>
      <div className={styles.header} style={{
            
            color: "green",
            gap: "50px",
          }}>
        <h2>Perfiles de acceso:</h2>
        
          <Button
            onClick={() => {
              setPerfilEdit(null); // nuevo perfil
              setModalOpen(true);
            }}
          >
            + Crear Perfil
          </Button>
        
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando perfiles...</div>}

      {!loading && perfiles.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay perfiles para mostrar</div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "50px" }}>
        {perfiles.map((p) => (
          <div key={p._id}>
            <p>
              {" "}
              {p.permisos?.admin && (
                <span className={styles.adminBadge}>Perfil Administrador</span>
              )}
            </p>
            <p> User: {p.nombre}</p>

            <p>Password: {p.password ?? "—"}</p>

            <div className={styles.actions}>
              <Button
                onClick={() => {
                  setPerfilEdit(p);
                  setModalOpen(true);
                }}
              >
                Editar
              </Button>
              <Button variant="danger" onClick={() => handleDelete(p._id)}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ModalProfile
          isOpen={modalOpen}
          perfilData={perfilEdit}
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            fetchPerfiles();
          }}
          token={token}
          API_URL={API_URL}
        />
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "50px",
          margin: "1rem",
        }}
      ></div>
    </div>
  );
};

export default Perfiles;
