import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "../styles/Compras.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faFileUpload, faPlusCircle, faBoxOpen } from "@fortawesome/free-solid-svg-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Compras = () => {
  const [tipoCompra, setTipoCompra] = useState("stock");
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/proveedores`)
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((err) => console.error("Error cargando proveedores:", err));
  }, []);

  const agregarCompra = () => {
    setCompras([
      ...compras,
      { id: compras.length + 1, proveedor: "", lugarEntrega: "", materiales: [] },
    ]);
  };

  const handleCompraChange = (index, field, value) => {
    const updatedCompras = [...compras];
    updatedCompras[index][field] = value;
    setCompras(updatedCompras);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      setCompras([...compras, { id: compras.length + 1, materiales: parsedData }]);
    };

    reader.readAsArrayBuffer(file);
  };

  const guardarCompras = async () => {
    if (compras.length === 0) {
      alert("No hay compras para guardar.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/compras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compras),
      });

      if (!response.ok) throw new Error("Error al guardar las compras");

      alert("Compras guardadas con éxito");
    } catch (error) {
      console.error("Error guardando compras:", error);
    }
  };

  // Mostrar el modal con los materiales de una compra
  const openModal = (compra) => {
    setSelectedCompra(compra);
    setShowModal(true);
  };

  return (
    <div className="compras-container">
      <h1><FontAwesomeIcon icon={faShoppingCart} /> Compras</h1>

      <div className="tipo-compra">
        <label>Seleccionar Tipo de Compra:</label>
        <select onChange={(e) => setTipoCompra(e.target.value)}>
          <option value="stock">Compra para Stock</option>
          <option value="obra">Compra para Obra</option>
          <option value="no-productiva">Compra No Productiva</option>
        </select>
      </div>

      <button className="add-button" onClick={agregarCompra}>
        <FontAwesomeIcon icon={faPlusCircle} /> Agregar Compra
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Proveedor</th>
            <th>Lugar de Entrega</th>
            <th>Materiales</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <select
                  value={compra.proveedor}
                  onChange={(e) => handleCompraChange(index, "proveedor", e.target.value)}
                >
                  <option value="">Seleccionar Proveedor</option>
                  {proveedores.map((prov) => (
                    <option key={prov.id} value={prov.nombre}>{prov.nombre}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={compra.lugarEntrega}
                  onChange={(e) => handleCompraChange(index, "lugarEntrega", e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => openModal(compra)}>
                  <FontAwesomeIcon icon={faBoxOpen} /> Ver Materiales
                </button>
              </td>
              <td>{tipoCompra}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="file-upload">
        <label>Cargar desde archivo Excel:</label>
        <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
        <FontAwesomeIcon icon={faFileUpload} className="upload-icon" />
      </div>

      <button className="save-button" onClick={guardarCompras}>
        Guardar Compras
      </button>

      {/* MODAL */}
      {showModal && selectedCompra && (
        <div className="modal-background" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h2>Materiales de la Compra {selectedCompra.id}</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {selectedCompra.materiales.length > 0 ? (
                  selectedCompra.materiales.map((mat, index) => (
                    <tr key={index}>
                      <td>{mat.codigo || "N/A"}</td>
                      <td>{mat.descripcion || "Sin descripción"}</td>
                      <td>{mat.cantidad || 0}</td>
                      <td>{mat.observaciones || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">No hay materiales cargados</td></tr>
                )}
              </tbody>
            </table>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compras;
