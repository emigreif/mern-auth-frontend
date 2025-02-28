import React, { useState } from "react";
import "../styles/Mediciones.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPlusCircle, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const Mediciones = () => {
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [tipologias, setTipologias] = useState([]);

  // Función para seleccionar una obra
  const handleSeleccionObra = (obra) => {
    setObraSeleccionada(obra);
    setUbicaciones([]); // Reiniciar ubicaciones al cambiar de obra
  };

  // Función para agregar una nueva ubicación de vano
  const agregarUbicacion = () => {
    setUbicaciones([
      ...ubicaciones,
      { piso: "", cantidad: 1, tipologias: [] },
    ]);
  };

  // Función para actualizar ubicaciones
  const handleUbicacionChange = (index, field, value) => {
    const updatedUbicaciones = [...ubicaciones];
    updatedUbicaciones[index][field] = value;
    setUbicaciones(updatedUbicaciones);
  };

  // Función para agregar una nueva tipología
  const agregarTipologia = () => {
    setTipologias([
      ...tipologias,
      { codigo: "", tipo: "", ancho: "", alto: "" },
    ]);
  };

  // Función para actualizar una tipología
  const handleTipologiaChange = (index, field, value) => {
    const updatedTipologias = [...tipologias];
    updatedTipologias[index][field] = value;
    setTipologias(updatedTipologias);
  };

  // Función para asignar tipologías a ubicaciones
  const asignarTipologia = (ubicacionIndex, tipologia) => {
    const updatedUbicaciones = [...ubicaciones];
    updatedUbicaciones[ubicacionIndex].tipologias.push(tipologia);
    setUbicaciones(updatedUbicaciones);
  };

  return (
    <div className="mediciones-container">
      <h1><FontAwesomeIcon icon={faClipboardList} /> Mediciones</h1>

      {/* Selección de obra */}
      <div className="seleccion-obra">
        <label>Seleccionar Obra:</label>
        <select onChange={(e) => handleSeleccionObra(e.target.value)}>
          <option value="">-- Seleccione una obra --</option>
          <option value="obra1">Obra 1</option>
          <option value="obra2">Obra 2</option>
        </select>
      </div>

      {/* Sección de ubicaciones */}
      {obraSeleccionada && (
        <div className="ubicaciones-container">
          <h2>Ubicaciones de Vanos</h2>
          <button className="add-button" onClick={agregarUbicacion}>
            <FontAwesomeIcon icon={faPlusCircle} /> Agregar Ubicación
          </button>
          <table>
            <thead>
              <tr>
                <th>Piso</th>
                <th>Cantidad</th>
                <th>Tipologías Asignadas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map((ubicacion, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" value={ubicacion.piso} onChange={(e) => handleUbicacionChange(index, "piso", e.target.value)} />
                  </td>
                  <td>
                    <input type="number" min="1" value={ubicacion.cantidad} onChange={(e) => handleUbicacionChange(index, "cantidad", e.target.value)} />
                  </td>
                  <td>
                    {ubicacion.tipologias.map((t, i) => (
                      <span key={i} className="tipologia-tag">{t.codigo}</span>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => asignarTipologia(index, { codigo: "T1", tipo: "Ventana", ancho: 100, alto: 200 })}>
                      Asignar Tipología
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sección de tipologías */}
      {obraSeleccionada && (
        <div className="tipologias-container">
          <h2>Lista de Tipologías</h2>
          <button className="add-button" onClick={agregarTipologia}>
            <FontAwesomeIcon icon={faPlusCircle} /> Agregar Tipología
          </button>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Tipo</th>
                <th>Ancho (cm)</th>
                <th>Alto (cm)</th>
              </tr>
            </thead>
            <tbody>
              {tipologias.map((tipologia, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" value={tipologia.codigo} onChange={(e) => handleTipologiaChange(index, "codigo", e.target.value)} />
                  </td>
                  <td>
                    <input type="text" value={tipologia.tipo} onChange={(e) => handleTipologiaChange(index, "tipo", e.target.value)} />
                  </td>
                  <td>
                    <input type="number" min="1" value={tipologia.ancho} onChange={(e) => handleTipologiaChange(index, "ancho", e.target.value)} />
                  </td>
                  <td>
                    <input type="number" min="1" value={tipologia.alto} onChange={(e) => handleTipologiaChange(index, "alto", e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Subida de archivo Excel */}
      <div className="file-upload">
        <label>Cargar Tipologías desde Excel</label>
        <input type="file" accept=".xls,.xlsx" />
        <FontAwesomeIcon icon={faFileExcel} className="excel-icon" />
      </div>
    </div>
  );
};

export default Mediciones;
