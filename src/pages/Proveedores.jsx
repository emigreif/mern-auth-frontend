// frontend/src/pages/Proveedores.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import NuevoMovimientoProveedor from "../components/NuevoMovimientoProveedor.jsx"; // Modal para crear mov.

export default function Proveedores() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [proveedores, setProveedores] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  // Movimientos del proveedor seleccionado
  const [movimientos, setMovimientos] = useState([]);
  const [showMovimientos, setShowMovimientos] = useState(false);

  // Modal de nuevo movimiento
  const [isNuevoMovOpen, setIsNuevoMovOpen] = useState(false);

  // Cargar lista de proveedores
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

  // Abrir detalle de movimientos
  const handleOpenMovimientos = async (prov) => {
    setSelectedProveedor(prov);
    setErrorMsg("");
    try {
      // Llamamos a contabilidad?proveedor=xxx
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

  // Abrir modal de nuevo movimiento
  const handleNuevoMovimiento = (prov) => {
    setSelectedProveedor(prov);
    setIsNuevoMovOpen(true);
  };

  // Al guardar un nuevo movimiento, recargamos lista de proveedores y cerramos
  const handleMovCreated = () => {
    fetchProveedores();
    // Si estamos viendo los movimientos de ese proveedor, recargar
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
                  <strong>{mov.tipo}</strong> - {new Date(mov.fecha).toLocaleDateString()} - 
                  Monto: ${mov.monto} 
                  {mov.subIndiceFactura && ` (${mov.subIndiceFactura})`}
                </p>
                <p>{mov.descripcion}</p>
                {/* Partidas de Obra */}
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
