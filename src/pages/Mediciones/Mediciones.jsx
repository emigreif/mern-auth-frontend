// src/pages/Mediciones.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Mediciones.module.css";

// Se asume que estos modales existen
import ModalUbicaciones from "../../components/ModalUbicaciones/ModalUbicaciones.jsx";
import ModalTipologias from "../../components/ModalTipologias/ModalTipologias.jsx";
import ModalAsignacion from "../../components/ModalAsignacion/ModalAsignacion.jsx";
import ModalPlanillaMedicion from "../../components/ModalPlanillaMedicion/ModalPlanillaMedicion.jsx";
import ModalReporteMedicion from "../../components/ModalReporteMedicion/ModalReporteMedicion.jsx";

const Mediciones = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [obras, setObras] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para abrir/cerrar modales
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [modalUbicacionesOpen, setModalUbicacionesOpen] = useState(false);
  const [modalTipologiasOpen, setModalTipologiasOpen] = useState(false);
  const [modalAsignacionOpen, setModalAsignacionOpen] = useState(false);
  const [modalPlanillaOpen, setModalPlanillaOpen] = useState(false);
  const [modalReporteOpen, setModalReporteOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchObras();
  }, [token]);

  const fetchObras = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al obtener obras");
      }
      const data = await res.json();
      setObras(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para abrir cada modal
  const handleOpenUbicaciones = (obra) => {
    setObraSeleccionada(obra);
    setModalUbicacionesOpen(true);
  };
  const handleOpenTipologias = (obra) => {
    setObraSeleccionada(obra);
    setModalTipologiasOpen(true);
  };
  const handleOpenAsignacion = (obra) => {
    setObraSeleccionada(obra);
    setModalAsignacionOpen(true);
  };
  const handleOpenPlanilla = (obra) => {
    setObraSeleccionada(obra);
    setModalPlanillaOpen(true);
  };
  const handleOpenReporte = (obra) => {
    setObraSeleccionada(obra);
    setModalReporteOpen(true);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Mediciones</h1>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando obras...</div>}

      {!loading && obras.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay obras para mostrar</div>
      )}

      {!loading && obras.length > 0 && (
        <table className={styles.obrasTable}>
          <thead>
            <tr>
              <th>Código Obra</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obras.map((obra) => (
              <tr key={obra._id}>
                <td>{obra.codigoObra}</td>
                <td>{obra.nombre}</td>
                <td>
                  <button
                    className={styles.actionsBtn}
                    onClick={() => handleOpenUbicaciones(obra)}
                  >
                    Ubicaciones
                  </button>
                  <button
                    className={styles.actionsBtn}
                    onClick={() => handleOpenTipologias(obra)}
                  >
                    Tipologías
                  </button>
                  <button
                    className={styles.actionsBtn}
                    onClick={() => handleOpenAsignacion(obra)}
                  >
                    Asignación
                  </button>
                  <button
                    className={styles.actionsBtn}
                    onClick={() => handleOpenPlanilla(obra)}
                  >
                    Planilla
                  </button>
                  <button
                    className={styles.actionsBtn}
                    onClick={() => handleOpenReporte(obra)}
                  >
                    Reporte
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modales */}
      {modalUbicacionesOpen && obraSeleccionada && (
        <ModalUbicaciones
          obra={obraSeleccionada}
          onClose={() => setModalUbicacionesOpen(false)}
        />
      )}
      {modalTipologiasOpen && obraSeleccionada && (
        <ModalTipologias
          obra={obraSeleccionada}
          onClose={() => setModalTipologiasOpen(false)}
        />
      )}
      {modalAsignacionOpen && obraSeleccionada && (
        <ModalAsignacion
          obra={obraSeleccionada}
          onClose={() => setModalAsignacionOpen(false)}
        />
      )}
      {modalPlanillaOpen && obraSeleccionada && (
        <ModalPlanillaMedicion
          obra={obraSeleccionada}
          onClose={() => setModalPlanillaOpen(false)}
        />
      )}
      {modalReporteOpen && obraSeleccionada && (
        <ModalReporteMedicion
          obra={obraSeleccionada}
          onClose={() => setModalReporteOpen(false)}
        />
      )}
    </div>
  );
};

export default Mediciones;
