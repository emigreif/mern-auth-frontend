// frontend/src/pages/Proveedores.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import NuevoMovimientoProveedor from "../components/NuevoMovimientoProveedor.jsx";

export default function Proveedores() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [proveedores, setProveedores] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  // Movimientos
  const [movimientos, setMovimientos] = useState([]);
  const [showMovimientos, setShowMovimientos] = useState(false);

  // Modal: nuevo movimiento
  const [isNuevoMovOpen, setIsNuevoMovOpen] = useState(false);

  useEffect(() => {
    if (token) fetchProveedores();
  }, [token]);

  const fetchProveedores = async () => {
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener proveedores");
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleOpenMovimientos = async (prov) => {
    setSelectedProveedor(prov);
    setErrorMsg("");
    try {
      // GET /api/contabilidad?proveedor=xxx
      const url = `${API_URL}/api/contabilidad?proveedor=${prov._id}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Error al obtener movimientos");
      const data = await res.json();
      setMovimientos(data);
      setShowMovimientos(true);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleNuevoMovimiento = (prov) => {
    setSelectedProveedor(prov);
    setIsNuevoMovOpen(true);
  };

  const handleMovCreated = () => {
    // Recargar proveedores
    fetchProveedores();
    // Si estamos viendo movimientos, recargar
    if (selectedProveedor) {
      handleOpenMovimientos(selectedProveedor);
    }
  };

  return (
    <div className="page-contenedor">
      <h1>Proveedores</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <div className="proveedores-list">
        {proveedores.map((prov) => (
          <div key={prov._id} className="proveedor-card">
            <h2>{prov.nombre}</h2>
            <p><strong>Saldo:</strong> ${prov.saldo?.toFixed(2)}</p>
            <button onClick={() => handleOpenMovimientos(prov)}>Ver Movimientos</button>
            <button onClick={() => handleNuevoMovimiento(prov)}>+ Nuevo Movimiento</button>
          </div>
        ))}
      </div>

      {/* Modal Movimientos */}
      {showMovimientos && selectedProveedor && (
        <div className="modal-overlay" onClick={() => setShowMovimientos(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Movimientos de {selectedProveedor.nombre}</h2>
            <button onClick={() => setShowMovimientos(false)}>Cerrar</button>

            {movimientos.map((mov) => (
              <div key={mov._id} className="mov-card">
                <p>
                  <strong>{mov.tipo}</strong> - {new Date(mov.fecha).toLocaleDateString()} 
                  - Monto: ${mov.monto}
                  {mov.subIndiceFactura && ` [${mov.subIndiceFactura}]`}
                </p>
                <p>{mov.descripcion}</p>

                {/* Cheque Info */}
                {mov.tipo.includes("CHEQUE") && mov.datosCheque && (
                  <div style={{ borderLeft: "2px solid #aaa", paddingLeft: "8px" }}>
                    <p>Cheque N°: {mov.datosCheque.numeroCheque} - Banco: {mov.datosCheque.banco}</p>
                    <p>Venc: {mov.datosCheque.fechaVencimiento?.slice(0,10)} - Estado: {mov.datosCheque.estadoCheque}</p>
                    {mov.datosCheque.endosadoA && <p>Endosado a: {mov.datosCheque.endosadoA}</p>}
                  </div>
                )}

                {/* Transfer Info */}
                {mov.tipo.includes("TRANSFERENCIA") && mov.datosTransferencia && (
                  <div style={{ borderLeft: "2px solid #aaa", paddingLeft: "8px" }}>
                    <p>Comprobante: {mov.datosTransferencia.numeroComprobante}</p>
                    <p>Banco Origen: {mov.datosTransferencia.bancoOrigen}</p>
                    <p>Banco Destino: {mov.datosTransferencia.bancoDestino}</p>
                    {mov.fechaAcreditacion && <p>Fecha Acreditación: {mov.fechaAcreditacion.slice(0,10)}</p>}
                  </div>
                )}

                {/* Partidas Obra */}
                {mov.partidasObra?.length > 0 && (
                  <ul>
                    {mov.partidasObra.map((po, i) => (
                      <li key={i}>
                        {po.obra?.nombre || "Obra??"} => ${po.monto}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Nuevo Movimiento */}
      {isNuevoMovOpen && selectedProveedor && (
        <NuevoMovimientoProveedor
          proveedorId={selectedProveedor._id}
          onSuccess={handleMovCreated}
          onClose={() => setIsNuevoMovOpen(false)}
        />
      )}
    </div>
  );
}
