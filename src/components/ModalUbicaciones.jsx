// frontend/src/components/ModalUbicaciones.jsx
import React, { useState } from "react";

export default function ModalUbicaciones({ obra, onClose }) {
  const [pisos, setPisos] = useState([]); 
  // Cada elemento: { rango: "1", ubicaciones: 5 } 
  // o { rango: "2-4", ubicaciones: 3 }, etc.

  const handleAddPiso = () => {
    setPisos([...pisos, { rango: "", ubicaciones: 1 }]);
  };

  const handleChangePiso = (index, field, value) => {
    const updated = [...pisos];
    updated[index][field] = value;
    setPisos(updated);
  };

  const handleGenerate = () => {
    // Parsear cada rango, ej. "1-3" => 1,2,3 o "1,5" => 1 y 5
    // y crear "pXuY" para cada
    // Luego enviarlo al backend => POST /api/ubicaciones/generar (ejemplo)
    // con la data { obraId: obra._id, ubicacionesGeneradas: [...] }
    // Simplificado:
    console.log("Generar ubicaciones", pisos);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Carga de Ubicaciones - Obra {obra.nombre}</h2>
        <p>Define los pisos y la cantidad de ubicaciones en cada piso/rango.</p>
        
        {pisos.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: "1rem" }}>
            <input
              type="text"
              placeholder="Piso(s) (ej: 1-3, 5, 7-9)"
              value={p.rango}
              onChange={(e) => handleChangePiso(i, "rango", e.target.value)}
            />
            <input
              type="number"
              placeholder="Cant. Ubicaciones"
              value={p.ubicaciones}
              onChange={(e) => handleChangePiso(i, "ubicaciones", e.target.value)}
            />
          </div>
        ))}

        <button onClick={handleAddPiso}>+ Agregar Piso</button>
        <button onClick={handleGenerate}>Generar Ubicaciones</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
