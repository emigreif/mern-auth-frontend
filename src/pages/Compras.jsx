// src/pages/Compras.jsx

import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import * as XLSX from "xlsx";

export default function Compras() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Lista de compras y proveedores
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // Filtro
  const [searchTerm, setSearchTerm] = useState("");

  // Modal principal (crear/editar compra)
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [editingCompra, setEditingCompra] = useState(null);

  // Sub-modal para crear proveedor
  const [isProveedorModalOpen, setIsProveedorModalOpen] = useState(false);

  // Sub-modal para items (pedido) e importación de Excel
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);

  // Form principal con todos los campos de tu modelo de “Compra”
  // Ajusta según tu modelo (ej. “obra”, “direccionEntrega”, “tipoCompra”, etc.)
  const [compraForm, setCompraForm] = useState({
    proveedor: "",
    obra: "", // si la compra está asociada a una Obra
    direccionEntrega: "",
    numeroPedido: "", // puede generarse automáticamente en backend
    fechaCompra: "",
    factura: "",
    remito: "",
    // Podrías tener “tipo” => "aluminio", "vidrios", etc., si usas un solo endpoint
  });

  // Array de items (por ejemplo, “pedido” o “productos”)
  const [itemsForm, setItemsForm] = useState({
    pedido: [], // [{ codigo, descripcion, cantidad, ... }]
  });

  // Form para crear un nuevo proveedor
  const [proveedorForm, setProveedorForm] = useState({
    nombre: "",
    direccion: "",
    emails: [""],
    telefono: "",
    whatsapp: "",
    rubro: [],
  });

  // 1. Cargar compras y proveedores
  useEffect(() => {
    if (token) {
      fetchCompras();
      fetchProveedores();
    }
  }, [token]);

  const fetchCompras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/compras`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener compras");
      const data = await res.json();
      setCompras(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener proveedores");
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Filtro
  const filteredCompras = compras.filter((c) =>
    (c.numeroPedido || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Crear nueva compra
  const handleOpenCreate = () => {
    setEditingCompra(null);
    setCompraForm({
      proveedor: "",
      obra: "",
      direccionEntrega: "",
      numeroPedido: "",
      fechaCompra: "",
      factura: "",
      remito: "",
    });
    setItemsForm({ pedido: [] });
    setIsMainModalOpen(true);
  };

  // 3. Editar compra
  const handleOpenEdit = (compra) => {
    setEditingCompra(compra);
    setCompraForm({
      proveedor: compra.proveedor?._id || "",
      obra: compra.obra?._id || "",
      direccionEntrega: compra.direccionEntrega || "",
      numeroPedido: compra.numeroPedido || "",
      fechaCompra: compra.fechaCompra ? compra.fechaCompra.slice(0, 10) : "",
      factura: compra.factura || "",
      remito: compra.remito || "",
    });
    setItemsForm({
      pedido: compra.pedido || [],
    });
    setIsMainModalOpen(true);
  };

  // 4. Guardar compra (POST/PUT)
  const handleSaveCompra = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...compraForm, ...itemsForm };
      if (editingCompra) {
        // PUT
        const res = await fetch(`${API_URL}/api/compras/${editingCompra._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al editar compra");
        const updated = await res.json();
        setCompras(
          compras.map((c) => (c._id === updated._id ? updated : c))
        );
      } else {
        // POST
        const res = await fetch(`${API_URL}/api/compras`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al crear compra");
        const newCompra = await res.json();
        setCompras([...compras, newCompra]);
      }
      setIsMainModalOpen(false);
    } catch (error) {
      console.error("Error saving compra:", error);
    }
  };

  // 5. Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta compra?")) return;
    try {
      const res = await fetch(`${API_URL}/api/compras/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar compra");
      setCompras(compras.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Manejo de form principal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompraForm({ ...compraForm, [name]: value });
  };

  // Sub-modal para Items
  const handleOpenItems = () => {
    setIsItemsModalOpen(true);
  };
  const handleCloseItems = () => {
    setIsItemsModalOpen(false);
  };

  // Sub-modal para crear proveedor
  const handleOpenProveedorModal = () => {
    setProveedorForm({
      nombre: "",
      direccion: "",
      emails: [""],
      telefono: "",
      whatsapp: "",
      rubro: [],
    });
    setIsProveedorModalOpen(true);
  };
  const handleCloseProveedorModal = () => {
    setIsProveedorModalOpen(false);
  };

  // Manejo form de proveedor
  const handleProveedorFormChange = (e) => {
    const { name, value } = e.target;
    setProveedorForm({ ...proveedorForm, [name]: value });
  };

  const handleSaveProveedor = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/proveedores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(proveedorForm),
      });
      if (!res.ok) throw new Error("Error al crear proveedor");
      const newProv = await res.json();
      setProveedores([...proveedores, newProv]);
      // Asignar a la compra
      setCompraForm((prev) => ({ ...prev, proveedor: newProv._id }));
      setIsProveedorModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-contenedor">
      <h1>Compras</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Filtrar compras por nro pedido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleOpenCreate}>+ Agregar Compra</button>
      </div>

      {/* Listado de compras en tarjetas */}
      <div className="compras-list">
        {filteredCompras.map((compra) => (
          <div key={compra._id} className="compra-card">
            <div className="compra-card-header">
              <h2>
                Nro Pedido: {compra.numeroPedido || "N/D"}
              </h2>
              <span>
                Fecha: {compra.fechaCompra ? compra.fechaCompra.slice(0, 10) : "N/D"}
              </span>
            </div>
            <div className="compra-card-info">
              <p>
                <strong>Proveedor:</strong>{" "}
                {compra.proveedor && compra.proveedor.nombre
                  ? compra.proveedor.nombre
                  : "N/D"}
              </p>
              <p>
                <strong>Dirección Entrega:</strong> {compra.direccionEntrega}
              </p>
              <p>
                <strong>Factura:</strong> {compra.factura || "N/D"}
              </p>
              <p>
                <strong>Remito:</strong> {compra.remito || "N/D"}
              </p>
            </div>
            <div className="compra-card-footer">
              <button onClick={() => handleOpenEdit(compra)}>Editar</button>
              <button onClick={() => handleDelete(compra._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal principal (crear/editar compra) */}
      <ModalBase
        isOpen={isMainModalOpen}
        onClose={() => setIsMainModalOpen(false)}
        title={editingCompra ? "Editar Compra" : "Nueva Compra"}
      >
        <form onSubmit={handleSaveCompra}>
          {/* Proveedor */}
          <div className="form-group">
            <label>Proveedor</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select
                name="proveedor"
                value={compraForm.proveedor}
                onChange={handleInputChange}
              >
                <option value="">-- Seleccionar --</option>
                {proveedores.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleOpenProveedorModal}>
                + Nuevo
              </button>
            </div>
          </div>

          {/* Obra (si aplica) */}
          <div className="form-group">
            <label>Obra (ID o Selección)</label>
            <input
              type="text"
              name="obra"
              value={compraForm.obra}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Dirección Entrega</label>
            <input
              type="text"
              name="direccionEntrega"
              value={compraForm.direccionEntrega}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Fecha de Compra</label>
            <input
              type="date"
              name="fechaCompra"
              value={compraForm.fechaCompra}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Nro Pedido</label>
            <input
              type="text"
              name="numeroPedido"
              value={compraForm.numeroPedido}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Factura</label>
            <input
              type="text"
              name="factura"
              value={compraForm.factura}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Remito</label>
            <input
              type="text"
              name="remito"
              value={compraForm.remito}
              onChange={handleInputChange}
            />
          </div>

          {/* Items (pedido) */}
          <button type="button" onClick={() => setIsItemsModalOpen(true)}>
            Editar Items
          </button>

          <div className="form-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setIsMainModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>

      {/* Sub-modal para items */}
      <ItemsModal
        isOpen={isItemsModalOpen}
        onClose={handleCloseItems}
        title="Items de la Compra"
        items={itemsForm.pedido}
        setItems={(newItems) => setItemsForm({ pedido: newItems })}
      />

      {/* Sub-modal para crear nuevo proveedor */}
      <ModalBase
        isOpen={isProveedorModalOpen}
        onClose={handleCloseProveedorModal}
        title="Nuevo Proveedor"
      >
        <form onSubmit={handleSaveProveedor}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={proveedorForm.nombre}
              onChange={handleProveedorFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={proveedorForm.direccion}
              onChange={handleProveedorFormChange}
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={proveedorForm.telefono}
              onChange={handleProveedorFormChange}
            />
          </div>
          <div className="form-group">
            <label>Whatsapp</label>
            <input
              type="text"
              name="whatsapp"
              value={proveedorForm.whatsapp}
              onChange={handleProveedorFormChange}
            />
          </div>
          {/* Emails, rubro, etc. - Ajusta según tu modelo */}
          <div className="form-actions">
            <button type="submit">Crear Proveedor</button>
            <button type="button" onClick={handleCloseProveedorModal}>
              Cancelar
            </button>
          </div>
        </form>
      </ModalBase>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Sub-componente: ItemsModal
   Permite importar Excel, ver preview, y administrar items de la compra
-------------------------------------------------------------------------- */
function ItemsModal({ isOpen, onClose, title, items, setItems }) {
  const [previewData, setPreviewData] = useState([]);

  // Importar Excel
  const handleImportExcel = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Ajustar índices según tus columnas
        const rows = jsonData.slice(1).map((row) => ({
          codigo: row[0] || "",
          descripcion: row[1] || "",
          cantidad: parseFloat(row[2]) || 0,
          // Ajusta más campos si necesitas: largo, precio, color, etc.
        }));

        setPreviewData(rows);
      } catch (error) {
        console.error("Error al leer Excel:", error);
        alert("Error al importar Excel");
      }
    };
    input.click();
  };

  // Agregar previewData a items
  const handleAddPreviewToItems = () => {
    setItems([...items, ...previewData]);
    setPreviewData([]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>{title}</h2>
        <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <button onClick={handleImportExcel}>Importar Excel</button>

          {/* Preview de lo importado */}
          {previewData.length > 0 && (
            <div style={{ margin: "1rem 0" }}>
              <h3>Datos Importados (Preview)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.codigo}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleAddPreviewToItems}>
                Agregar estos {previewData.length} ítems
              </button>
            </div>
          )}

          {/* Ítems ya confirmados */}
          <h3>Ítems Actuales</h3>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.codigo}</td>
                  <td>{item.descripcion}</td>
                  <td>{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
