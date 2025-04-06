// src/pages/Mediciones.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalUbicaciones from "../components/modals/ModalUbicaciones.jsx";
import ModalImportarTipologiasOV from "../components/modals/ModalImportarTipologiasOV.jsx";
import ModalAsignacion from "../components/modals/ModalAsignacion.jsx";
import ModalPlanillaMedicion from "../components/modals/ModalPlanillaMedicion.jsx";
import ModalReporteMedicion from "../components/modals/ModalReporteMedicion.jsx";
import Button from "../components/ui/Button.jsx";
import Table from "../components/ui/Table.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";

const Mediciones = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [obras, setObras] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [modalUbicacionesOpen, setModalUbicacionesOpen] = useState(false);
  const [modalTipologiasOpen, setModalTipologiasOpen] = useState(false);
  const [modalAsignacionOpen, setModalAsignacionOpen] = useState(false);
  const [modalPlanillaOpen, setModalPlanillaOpen] = useState(false);
  const [modalReporteOpen, setModalReporteOpen] = useState(false);

  useEffect(() => {
    if (token) fetchObras();
  }, [token]);

  const fetchObras = async () => {
    setLoading(true);
    setErrorMsg("");
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

  const abrirModal = (modal, obra) => {
    setObraSeleccionada(obra);
    switch (modal) {
      case "ubicaciones":
        setModalUbicacionesOpen(true); break;
      case "tipologias":
        setModalTipologiasOpen(true); break;
      case "asignacion":
        setModalAsignacionOpen(true); break;
      case "planilla":
        setModalPlanillaOpen(true); break;
      case "reporte":
        setModalReporteOpen(true); break;
      default:
        break;
    }
  };

  const filteredObras = obras.filter((obra) =>
    [obra.nombre, obra.codigoObra]
      .some(val => val?.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Mediciones</h1>
      </div>

      <div style={{ marginBottom: 10, maxWidth: 300 }}>
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar obras..."
        />
      </div>

      {errorMsg && <p >{errorMsg}</p>}
      {loading && <div >Cargando obras...</div>}
      {!loading && filteredObras.length === 0 && !errorMsg && (
        <div >No hay obras para mostrar</div>
      )}

      {!loading && filteredObras.length > 0 && (
        <Table headers={["Código Obra", "Nombre", "Acciones"]}>
          {filteredObras.map((obra) => (
            <tr key={obra._id}>
              <td>{obra.codigoObra}</td>
              <td>{obra.nombre}</td>
              <td style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <Button onClick={() => abrirModal("ubicaciones", obra)}>📍 Ubicaciones</Button>
                <Button onClick={() => abrirModal("tipologias", obra)}>🧱 Tipologías</Button>
                <Button onClick={() => abrirModal("asignacion", obra)}>🧩 Asignación</Button>
                <Button onClick={() => abrirModal("planilla", obra)}>📄 Planilla</Button>
                <Button onClick={() => abrirModal("reporte", obra)}>📊 Reporte</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {modalUbicacionesOpen && obraSeleccionada && (
        <ModalUbicaciones
          obra={obraSeleccionada}
          onClose={() => setModalUbicacionesOpen(false)}
        />
      )}
      {modalTipologiasOpen && obraSeleccionada && (
        <ModalImportarTipologiasOV
          obra={obraSeleccionada}
          endpoint="/api/tipologias/importar"
          titulo="Cargar Tipologías de Medición"
          onClose={() => setModalTipologiasOpen(false)}
          onSaved={fetchObras}
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
