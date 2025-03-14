// frontend/src/pages/Proveedores.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import NuevoMovimientoProveedor from "../components/NuevoMovimientoProveedor.jsx";
import NuevoProveedor from "../components/NuevoProveedor.jsx";

export default function Proveedores() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [proveedores, setProveedores] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Movimientos
  const [movimientos, setMovimientos] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [showMovimientos, setShowMovimientos] = useState(false);

  // Modal: nuevo movimiento
  const [isNuevoMovOpen, setIsNuevoMovOpen] = useState(false);

  // Modal: nuevo proveedor
  const [isNuevoProvOpen, setIsNuevoProvOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchProveedores();
    }
  }, [token]);

  const fetchProveedores = async () => {
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        headers: { Authorization: `Bearer ${token}` },
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
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Al crear un nuevo movimiento, recargamos lista
  const handleMovCreated = () => {
    fetchProveedores();
    if (selectedProveedor) {
      handleOpenMovimientos(selectedProveedor);
    }
  };

  // Crear nuevo proveedor (abrir modal)
  const handleOpenNuevoProveedor = () => {
    setIsNuevoProvOpen(true);
  };

  // Cuando se crea un proveedor, recargamos
  const handleProveedorCreated = () => {
    setIsNuevoProvOpen(false);
    fetchProveedores();
  };

  return (
    <div className="page-contenedor">
      <h1>Proveedores</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {/* Botón para abrir modal de nuevo proveedor */}
      <button onClick={handleOpenNuevoProveedor}>+ Agregar Proveedor</button>

      <div className="proveedores-list" style={{ marginTop: "1rem" }}>
        {proveedores.map((prov) => (
          <div key={prov._id} className="proveedor-card">
            <h2>{prov.nombre}</h2>
            <p><strong>Dirección:</strong> {prov.direccion}</p>
            <p><strong>Saldo:</strong> ${prov.saldo?.toFixed(2)}</p>
            <p><strong>Rubros:</strong> {prov.rubro?.join(", ")}</p>

            <button onClick={() => handleOpenMovimientos(prov)}>
              Ver Movimientos
            </button>
            <button onClick={() => handleNuevoMovimiento(prov)}>
              + Nuevo Movimiento
            </button>
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
                  <strong>{mov.tipo}</strong> -{" "}
                  {new Date(mov.fecha).toLocaleDateString()} - Monto: $
                  {mov.monto}
                </p>
                <p>{mov.descripcion}</p>
                {/* Info de cheque / transferencia, etc. */}
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

      {/* Modal Nuevo Proveedor */}
      {isNuevoProvOpen && (
        <NuevoProveedor
          onCreated={handleProveedorCreated}
          onClose={() => setIsNuevoProvOpen(false)}
        />
      )}
    </div>
  );
}
