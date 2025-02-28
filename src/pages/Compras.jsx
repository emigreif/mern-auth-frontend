import React, { useState } from "react";
import "../styles/Compras.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faFileUpload, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Compras = () => {
  const [tipoCompra, setTipoCompra] = useState("stock");
  const [compras, setCompras] = useState([]);

  const agregarCompra = () => {
    setCompras([
      ...compras,
      { codigo: "", descripcion: "", cantidad: "", unidad: "", tipo: tipoCompra },
    ]);
  };

  const handleCompraChange = (index, field, value) => {
    const updatedCompras = [...compras];
    updatedCompras[index][field] = value;
    setCompras(updatedCompras);
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
        <FontAwesomeIcon icon={faPlusCircle} /> Agregar Producto
      </button>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra, index) => (
            <tr key={index}>
              <td>
                <input type="text" value={compra.codigo} onChange={(e) => handleCompraChange(index, "codigo", e.target.value)} />
              </td>
              <td>
                <input type="text" value={compra.descripcion} onChange={(e) => handleCompraChange(index, "descripcion", e.target.value)} />
              </td>
              <td>
                <input type="number" min="1" value={compra.cantidad} onChange={(e) => handleCompraChange(index, "cantidad", e.target.value)} />
              </td>
              <td>
                <input type="text" value={compra.unidad} onChange={(e) => handleCompraChange(index, "unidad", e.target.value)} />
              </td>
              <td>{compra.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="file-upload">
        <label>Cargar desde archivo Excel/PDF:</label>
        <input type="file" accept=".xls,.xlsx,.pdf" />
        <FontAwesomeIcon icon={faFileUpload} className="upload-icon" />
      </div>
    </div>
  );
};

export default Compras;
