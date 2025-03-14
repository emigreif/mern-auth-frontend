// frontend/src/components/ModalAsignacion.jsx
import React, { useState, useEffect } from "react";

export default function ModalAsignacion({ obra, onClose }) {
  const [tipologias, setTipologias] = useState([]); // { _id, codigo, descripcion, cantidad, asignados=0 }
  const [ubicaciones, setUbicaciones] = useState([]); // { _id, piso, ubicacion, tipologiaId? }
  const [selectedTip, setSelectedTip] = useState(null);

  useEffect(() => {
    // fetch tipologias => GET /api/tipologias?obraId=...
    // fetch ubicaciones => GET /api/ubicaciones?obraId=...
    // Asumimos ya guardadas en DB
  }, []);

  const handleSelectTip = (tip) => {
    setSelectedTip(tip);
  };

  const handleClickUbicacion = (u) => {
    if (!selectedTip) return;
    // Asignar o desasignar
    const ubIndex = ubicaciones.findIndex((x) => x._id === u._id);
    if (u.tipologiaId === selectedTip._id) {
      // Quitar la asignación
      const updatedU = { ...u, tipologiaId: null };
      const updatedArr = [...ubicaciones];
      updatedArr[ubIndex] = updatedU;
      setUbicaciones(updatedArr);

      // tipologias => selectedTip.asignados--
    } else if (!u.tipologiaId) {
      // Asignar
      // Chequear si la tipología tiene “disponible” > 0
      // etc.
      const updatedU = { ...u, tipologiaId: selectedTip._id };
      const updatedArr = [...ubicaciones];
      updatedArr[ubIndex] = updatedU;
      setUbicaciones(updatedArr);

      // selectedTip.asignados++ ...
    }
  };

  const handleGuardar = () => {
    // POST /api/asociacion => { obraId, asignaciones: [{ ubicacionId, tipologiaId }, ...] }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Asignación Tipologías ↔ Ubicaciones - {obra.nombre}</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          {/* Columna Tipologías */}
          <div style={{ flex: 1, border: "1px solid #ccc" }}>
            <h3>Tipologías</h3>
            {tipologias.map((t) => (
              <button
                key={t._id}
                onClick={() => handleSelectTip(t)}
                style={{ background: selectedTip?._id === t._id ? "#aaa" : "#fff" }}
              >
                {t.codigo} (disp={t.cantidad - (t.asignados || 0)})
              </button>
            ))}
          </div>

          {/* Columna Ubicaciones */}
          <div style={{ flex: 2, border: "1px solid #ccc" }}>
            <h3>Ubicaciones</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {ubicaciones.map((u) => (
                <button
                  key={u._id}
                  onClick={() => handleClickUbicacion(u)}
                  style={{
                    background: u.tipologiaId ? "#fdd" : "#dfd",
                    width: "80px",
                  }}
                >
                  {u.piso}{u.ubicacion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleGuardar}>Guardar Asignaciones</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
