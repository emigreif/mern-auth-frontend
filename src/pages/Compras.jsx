// frontend/src/pages/Compras.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalCompra from "../components/ModalCompra.jsx";
import ModalIngresoMaterial from "../components/ModalIngresoMaterial.jsx";

export default function Compras() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [tipo, setTipo] = useState("todas"); // "aluminio", "vidrios", "accesorios", "todas"
  const [compras, setCompras] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIngresoModalOpen, setIsIngresoModalOpen] = useState(false);
  const [editingCompra, setEditingCompra] = useState(null);

  useEffect(() => {
    if (token) {
      fetchCompras();
    }
  }, [token, tipo]);

  const fetchCompras = async () => {
    setErrorMsg("");
    try {
      let url = `${API_URL}/api/compras/${tipo}`;
      // si "todas", la ruta GET /api/compras/todas => en backend, filtra sin "tipo"
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener compras");
      const data = await res.json();
      setCompras(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleOpenCreate = () => {
    setEditingCompra(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (compra) => {
    setEditingCompra(compra);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompra(null);
    fetchCompras();
  };

  const handleOpenIngreso = (compra) => {
    setEditingCompra(compra);
    setIsIngresoModalOpen(true);
  };

  const handleCloseIngreso = () => {
    setIsIngresoModalOpen(false);
    setEditingCompra(null);
    fetchCompras();
  };

  const handleAnular = async (compraId) => {
    if (!confirm("¿Seguro que deseas anular esta orden de compra?")) return;
    try {
      // DELETE /api/compras/:tipo/:id
      // necesitamos el tipo => lo buscamos en la compra
      const c = compras.find((x) => x._id === compraId);
      if (!c) return;
      const url = `${API_URL}/api/compras/${c.tipo}/${compraId}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al anular la compra");
      fetchCompras();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Semáforo
  const getSemaforo = (compra) => {
    if (compra.estado === "anulado") return "🔴 Anulado";
    if (compra.estado === "completado") return "🟢 Completado";

    // si "pendiente", check si está cerca de la fechaEstimadaEntrega
    if (!compra.fechaEstimadaEntrega) return "🟡 Pendiente";
    const diasRestantes = (new Date(compra.fechaEstimadaEntrega) - new Date()) / (1000*60*60*24);
    if (diasRestantes < 0) return "🔴 Vencido";
    if (diasRestantes < 3) return "🟠 Próximo";
    return "🟡 Pendiente";
  };

  return (
    <div className="page-contenedor">
      <h1>Portal de Compras</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {/* Filtro por tipo */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Tipo:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="todas">Todas</option>
          <option value="aluminio">Aluminio</option>
          <option value="vidrios">Vidrios</option>
          <option value="accesorios">Accesorios</option>
        </select>
        <button onClick={handleOpenCreate}>+ Nueva Compra</button>
      </div>

      {/* Tabla */}
      <table className="table-base">
        <thead>
          <tr>
            <th>OC #</th>
            <th>Cód. Obra</th>
            <th>Obra</th>
            <th>Tipo</th>
            <th>Proveedor</th>
            <th>Estado</th>
            <th>Semáforo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((c) => (
            <tr key={c._id}>
              <td>{c.numeroOC}</td>
              <td>{c.obra?.codigoObra}</td>
              <td>{c.obra?.nombre}</td>
              <td>{c.tipo}</td>
              <td>{c.proveedor?.nombre}</td>
              <td>{c.estado}</td>
              <td>{getSemaforo(c)}</td>
              <td>
                {c.estado !== "anulado" && c.estado !== "completado" && (
                  <>
                    <button onClick={() => handleOpenEdit(c)}>Editar</button>
                    <button onClick={() => handleOpenIngreso(c)}>Ingreso</button>
                    <button onClick={() => handleAnular(c._id)}>Anular</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Nueva/Editar Compra */}
      {isModalOpen && (
        <ModalCompra
          editingCompra={editingCompra}
          onClose={handleCloseModal}
          onSaved={handleCloseModal}
        />
      )}

      {/* Modal de Ingreso de Material */}
      {isIngresoModalOpen && (
        <ModalIngresoMaterial
          compra={editingCompra}
          onClose={handleCloseIngreso}
          onSaved={handleCloseIngreso}
        />
      )}
    </div>
  );
}
