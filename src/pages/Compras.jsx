import React, { useState } from "react";
import "../styles/Compras.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faFileExcel, faFilePdf, faCartPlus, faPlusCircle, faClipboardList, faFileInvoice } from "@fortawesome/free-solid-svg-icons";

const Compras = () => {
  const [tipoCompra, setTipoCompra] = useState("productiva"); // productiva o no productiva
  const [categoriaCompra, setCategoriaCompra] = useState("perfiles");
  const [obraSeleccionada, setObraSeleccionada] = useState("");
  const [archivoSubido, setArchivoSubido] = useState(null);
  const [materiales, setMateriales] = useState([]);

  // Función para manejar la carga de archivos (Excel o PDF)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setArchivoSubido(file);
  };

  // Función para agregar un material manualmente
  const agregarMaterial = () => {
    setMateriales([...materiales, { tipo: "", descripcion: "", cantidad: "", unidad: "", recibido: 0, factura: "", remitos: [] }]);
  };

  // Función para actualizar el material en la lista
  const handleMaterialChange = (index, field, value) => {
    const updatedMateriales = [...materiales];
    updatedMateriales[index][field] = value;
    setMateriales(updatedMateriales);
  };

  // Función para registrar un ingreso parcial
  const registrarIngreso = (index) => {
    const cantidadRecibida = prompt("Ingrese cantidad recibida:");
    const numRemito = prompt("Ingrese número de remito:");

    if (cantidadRecibida && numRemito) {
      const updatedMateriales = [...materiales];
      updatedMateriales[index].remitos.push({ cantidad: cantidadRecibida, remito: numRemito });
      updatedMateriales[index].recibido += parseInt(cantidadRecibida, 10);
      setMateriales(updatedMateriales);
    }
  };

  return (
    <div className="compras-container">
      <h1><FontAwesomeIcon icon={faCartPlus} /> Gestión de Compras</h1>

      {/* Selección de tipo de compra */}
      <div className="tipo-compra">
        <label>Tipo de Compra</label>
        <select value={tipoCompra} onChange={(e) => setTipoCompra(e.target.value)}>
          <option value="productiva">Productiva (Perfiles, Vidrios, Accesorios)</option>
          <option value="noProductiva">No Productiva (Insumos, Librería, Herramientas)</option>
        </select>
      </div>

      {/* Selección de categoría si es productiva */}
      {tipoCompra === "productiva" && (
        <div className="categoria-compra">
          <label>Categoría</label>
          <select value={categoriaCompra} onChange={(e) => setCategoriaCompra(e.target.value)}>
            <option value="perfiles">Perfiles</option>
            <option value="vidrios">Vidrios</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>
      )}

      {/* Selección de obra si aplica */}
      {tipoCompra === "productiva" && (
        <div className="obra-seleccion">
          <label>Seleccionar Obra:</label>
          <input type="text" placeholder="Buscar obra..." value={obraSeleccionada} onChange={(e) => setObraSeleccionada(e.target.value)} />
        </div>
      )}

      {/* Subida de archivo */}
      <div className="file-upload">
        <label>Cargar Archivo (Excel / PDF)</label>
        <input type="file" accept=".xls,.xlsx,.pdf" onChange={handleFileUpload} />
        {archivoSubido && <p>Archivo cargado: {archivoSubido.name}</p>}
      </div>

      {/* Tabla de materiales */}
      <div className="materiales-container">
        <h2>Lista de Materiales</h2>
        <button className="add-material" onClick={agregarMaterial}>
          <FontAwesomeIcon icon={faPlusCircle} /> Agregar Material
        </button>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Unidad</th>
              <th>Recibido</th>
              <th>Remitos</th>
              <th>Factura</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((material, index) => (
              <tr key={index}>
                <td>
                  <select value={material.tipo} onChange={(e) => handleMaterialChange(index, "tipo", e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="perfiles">Perfiles</option>
                    <option value="vidrios">Vidrios</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="otros">Otros</option>
                  </select>
                </td>
                <td>
                  <input type="text" value={material.descripcion} onChange={(e) => handleMaterialChange(index, "descripcion", e.target.value)} />
                </td>
                <td>
                  <input type="number" value={material.cantidad} onChange={(e) => handleMaterialChange(index, "cantidad", e.target.value)} />
                </td>
                <td>
                  <input type="text" value={material.unidad} onChange={(e) => handleMaterialChange(index, "unidad", e.target.value)} />
                </td>
                <td>{material.recibido} / {material.cantidad}</td>
                <td>{material.remitos.map(r => `Remito: ${r.remito} (${r.cantidad})`).join(", ")}</td>
                <td>
                  <input type="text" value={material.factura} onChange={(e) => handleMaterialChange(index, "factura", e.target.value)} />
                </td>
                <td>
                  <button onClick={() => registrarIngreso(index)}>
                    <FontAwesomeIcon icon={faClipboardList} /> Ingresar Material
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón de guardar compra */}
      <button className="save-button">
        <FontAwesomeIcon icon={faCartPlus} /> Guardar Compra
      </button>
    </div>
  );
};

export default Compras;
