import React, { useState } from "react";
import "../styles/Mediciones.css";

const Mediciones = () => {
  const [obraSeleccionada, setObraSeleccionada] = useState("");
  const [ubicaciones, setUbicaciones] = useState([]);
  const [tipologias, setTipologias] = useState([]);
  const [tipologiasSeleccionadas, setTipologiasSeleccionadas] = useState([]);
  const [conjuntos, setConjuntos] = useState([]);

  // Función para agregar ubicaciones con múltiples pisos
  const agregarUbicaciones = (pisoStr, cantidad) => {
    if (!obraSeleccionada) {
      alert("Selecciona una obra antes de agregar ubicaciones.");
      return;
    }

    const pisos = parsePisos(pisoStr);
    const nuevasUbicaciones = pisos.flatMap((piso) =>
      Array.from({ length: cantidad }, (_, i) => ({
        piso,
        ubicacion: `${piso}-${i + 1}`,
        tipologias: [],
      }))
    );

    setUbicaciones([...ubicaciones, ...nuevasUbicaciones]);
  };

  // Función para convertir texto de pisos a array
  const parsePisos = (pisoStr) => {
    const pisos = [];
    pisoStr.split(",").forEach((parte) => {
      if (parte.includes("-")) {
        const [inicio, fin] = parte.split("-").map(Number);
        for (let i = inicio; i <= fin; i++) {
          pisos.push(i);
        }
      } else {
        pisos.push(Number(parte));
      }
    });
    return pisos;
  };

  // Función para agregar tipologías
  const agregarTipologia = () => {
    setTipologias([...tipologias, { codigo: "", tipo: "", ancho: "", alto: "", esConjunto: false }]);
  };

  // Función para asignar tipologías a ubicaciones seleccionadas
  const asignarTipologia = () => {
    if (tipologiasSeleccionadas.length === 0) {
      alert("Selecciona al menos una tipología para asignar.");
      return;
    }

    const updatedUbicaciones = ubicaciones.map((ubicacion) =>
      tipologiasSeleccionadas.includes(ubicacion.ubicacion)
        ? { ...ubicacion, tipologias: [...ubicacion.tipologias, ...tipologias] }
        : ubicacion
    );

    setUbicaciones(updatedUbicaciones);
    setTipologiasSeleccionadas([]); // Limpiar selección
  };

  // Función para crear conjuntos de tipologías
  const crearConjunto = () => {
    if (tipologias.length < 2) {
      alert("Debe haber al menos dos tipologías para formar un conjunto.");
      return;
    }

    const medidaConjunto = Math.max(...tipologias.map((t) => parseFloat(t.ancho))) + " x " + Math.max(...tipologias.map((t) => parseFloat(t.alto)));
    const conjunto = { id: conjuntos.length + 1, tipologias, medidaConjunto };

    setConjuntos([...conjuntos, conjunto]);
    setTipologias([]);
  };

  return (
    <div className="mediciones-container">
      <h1>Mediciones</h1>

      {/* Selección de Obra */}
      <div className="seleccion-obra">
        <label>Seleccionar Obra:</label>
        <select value={obraSeleccionada} onChange={(e) => setObraSeleccionada(e.target.value)}>
          <option value="">-- Seleccionar --</option>
          <option value="Obra 1">Obra 1</option>
          <option value="Obra 2">Obra 2</option>
        </select>
      </div>

      {/* Carga de Ubicaciones */}
      <div className="ubicaciones-container">
        <h2>Agregar Ubicaciones</h2>
        <input type="text" placeholder="Ej: 1,2,3-5" id="pisos" />
        <input type="number" min="1" placeholder="Cantidad por piso" id="cantidad" />
        <button onClick={() => agregarUbicaciones(document.getElementById("pisos").value, parseInt(document.getElementById("cantidad").value))}>Agregar</button>

        <h3>Ubicaciones</h3>
        <ul>
          {ubicaciones.map((ubicacion, index) => (
            <li key={index}>{`Piso ${ubicacion.piso} - Ubicación ${ubicacion.ubicacion}`}</li>
          ))}
        </ul>
      </div>

      {/* Carga de Tipologías */}
      <div className="tipologias-container">
        <h2>Tipologías</h2>
        <button onClick={agregarTipologia}>Agregar Tipología</button>
        {tipologias.map((tipologia, index) => (
          <div key={index} className="tipologia-item">
            <input type="text" placeholder="Código" value={tipologia.codigo} onChange={(e) => handleTipologiaChange(index, "codigo", e.target.value)} />
            <input type="text" placeholder="Tipo" value={tipologia.tipo} onChange={(e) => handleTipologiaChange(index, "tipo", e.target.value)} />
            <input type="number" placeholder="Ancho" value={tipologia.ancho} onChange={(e) => handleTipologiaChange(index, "ancho", e.target.value)} />
            <input type="number" placeholder="Alto" value={tipologia.alto} onChange={(e) => handleTipologiaChange(index, "alto", e.target.value)} />
          </div>
        ))}
      </div>

      {/* Asignar Tipologías */}
      <div className="asignacion-container">
        <h2>Asignar Tipologías</h2>
        <select multiple value={tipologiasSeleccionadas} onChange={(e) => setTipologiasSeleccionadas([...e.target.selectedOptions].map((option) => option.value))}>
          {ubicaciones.map((ubicacion, index) => (
            <option key={index} value={ubicacion.ubicacion}>{`Piso ${ubicacion.piso} - Ubicación ${ubicacion.ubicacion}`}</option>
          ))}
        </select>
        <button onClick={asignarTipologia}>Asignar</button>
      </div>

      {/* Creación de Conjuntos */}
      <div className="conjuntos-container">
        <h2>Conjuntos de Tipologías</h2>
        <button onClick={crearConjunto}>Crear Conjunto</button>
        <ul>
          {conjuntos.map((conjunto, index) => (
            <li key={index}>{`Conjunto ${conjunto.id} - Medida: ${conjunto.medidaConjunto}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Mediciones;
