// src/components/ModalTipologias/ModalTipologias.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "../ModalBase/ModalBase.jsx";

export default function ModalTipologias({ obra, onClose }) {
  const [tipologias, setTipologias] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [tempTip, setTempTip] = useState({
    codigo: "",
    descripcion: "",
    ancho: 0,
    alto: 0,
    cantidad: 1
  });

  const handleAddManual = () => {
    if (!tempTip.codigo.trim() || !tempTip.descripcion.trim()) {
      setErrorMsg("Código y Descripción son requeridos");
      return;
    }
    setTipologias([...tipologias, { ...tempTip }]);
    setTempTip({ codigo: "", descripcion: "", ancho: 0, alto: 0, cantidad: 1 });
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const imported = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;
        imported.push({
          codigo: row[0],
          descripcion: row[1],
          ancho: parseFloat(row[2]) || 0,
          alto: parseFloat(row[3]) || 0,
          cantidad: parseInt(row[4]) || 1
        });
      }
      setTipologias([...tipologias, ...imported]);
    } catch (err) {
      setErrorMsg("Error al importar Excel");
    }
  };

  const handleGuardar = () => {
    // POST /api/tipologias => { obraId, tipologias }
    onClose();
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Carga de Tipologías - Obra ${obra.nombre}`}>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <div style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
        <h3>Carga Manual</h3>
        <input
          type="text"
          placeholder="Código"
          value={tempTip.codigo}
          onChange={(e) => setTempTip({ ...tempTip, codigo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={tempTip.descripcion}
          onChange={(e) => setTempTip({ ...tempTip, descripcion: e.target.value })}
        />
        <input
          type="number"
          placeholder="Ancho"
          value={tempTip.ancho}
          onChange={(e) => setTempTip({ ...tempTip, ancho: e.target.value })}
        />
        <input
          type="number"
          placeholder="Alto"
          value={tempTip.alto}
          onChange={(e) => setTempTip({ ...tempTip, alto: e.target.value })}
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={tempTip.cantidad}
          onChange={(e) => setTempTip({ ...tempTip, cantidad: e.target.value })}
        />
        <button onClick={handleAddManual}>Agregar</button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <h3>Importar desde Excel</h3>
        <input type="file" accept=".xls,.xlsx" onChange={handleImportExcel} />
      </div>

      <h3>Lista de Tipologías</h3>
      <ul>
        {tipologias.map((t, i) => (
          <li key={i}>
            {t.codigo} - {t.descripcion} ({t.ancho}x{t.alto}), cant={t.cantidad}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleGuardar}>Guardar Tipologías</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </ModalBase>
  );
}
