// frontend/src/pages/Mediciones.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
// Supón que tenemos un endpoint GET /api/obras que retorna las obras del user
// Y endpoints para la parte de mediciones.

import ModalUbicaciones from "../components/ModalUbicaciones.jsx";
import ModalTipologias from "../components/ModalTipologias.jsx";
import ModalAsignacion from "../components/ModalAsignacion.jsx";
import ModalPlanillaMedicion from "../components/ModalPlanillaMedicion.jsx";
import ModalReporteMedicion from "../components/ModalReporteMedicion.jsx";

export default function Mediciones() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [obras, setObras] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Para abrir/cerrar modales
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [modalUbicacionesOpen, setModalUbicacionesOpen] = useState(false);
  const [modalTipologiasOpen, setModalTipologiasOpen] = useState(false);
  const [modalAsignacionOpen, setModalAsignacionOpen] = useState(false);
  const [modalPlanillaOpen, setModalPlanillaOpen] = useState(false);
  const [modalReporteOpen, setModalReporteOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchObras();
    }
  }, [token]);

  const fetchObras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener obras");
      const data = await res.json();
      setObras(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Al hacer clic en “Carga de Ubicaciones”
  const handleOpenUbicaciones = (obra) => {
    setObraSeleccionada(obra);
    setModalUbicacionesOpen(true);
  };

  // Al hacer clic en “Carga de Tipologías”
  const handleOpenTipologias = (obra) => {
    setObraSeleccionada(obra);
    setModalTipologiasOpen(true);
  };

  // Al hacer clic en “Asignación Tipologías”
  const handleOpenAsignacion = (obra) => {
    setObraSeleccionada(obra);
    setModalAsignacionOpen(true);
  };

  // Al hacer clic en “Planilla de Medición”
  const handleOpenPlanilla = (obra) => {
    setObraSeleccionada(obra);
    setModalPlanillaOpen(true);
  };

  // Al hacer clic en “Reporte de Medición”
  const handleOpenReporte = (obra) => {
    setObraSeleccionada(obra);
    setModalReporteOpen(true);
  };

  return (
    <div className="page-contenedor">
      <h1>Mediciones</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {/* Listado de Obras */}
      <table className="table-base">
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
                <button onClick={() => handleOpenUbicaciones(obra)}>Ubicaciones</button>
                <button onClick={() => handleOpenTipologias(obra)}>Tipologías</button>
                <button onClick={() => handleOpenAsignacion(obra)}>Asignación</button>
                <button onClick={() => handleOpenPlanilla(obra)}>Planilla</button>
                <button onClick={() => handleOpenReporte(obra)}>Reporte</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modales */}
      {modalUbicacionesOpen && (
        <ModalUbicaciones
          obra={obraSeleccionada}
          onClose={() => setModalUbicacionesOpen(false)}
        />
      )}
      {modalTipologiasOpen && (
        <ModalTipologias
          obra={obraSeleccionada}
          onClose={() => setModalTipologiasOpen(false)}
        />
      )}
      {modalAsignacionOpen && (
        <ModalAsignacion
          obra={obraSeleccionada}
          onClose={() => setModalAsignacionOpen(false)}
        />
      )}
      {modalPlanillaOpen && (
        <ModalPlanillaMedicion
          obra={obraSeleccionada}
          onClose={() => setModalPlanillaOpen(false)}
        />
      )}
      {modalReporteOpen && (
        <ModalReporteMedicion
          obra={obraSeleccionada}
          onClose={() => setModalReporteOpen(false)}
        />
      )}
    </div>
  );
}
