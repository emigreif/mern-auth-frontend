// src/components/ModalTipologias.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase";
import styles from "../styles/modals/ModalTipologias.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalTipologias({ onClose, onCreated }) {
  const [listaTipologias, setListaTipologias] = useState([]);
  const [archivoExcel, setArchivoExcel] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [manual, setManual] = useState({ tipo: "", descripcion: "", base: "", altura: "", cantidad: 1 });

  const handleExcelChange = (e) => {
    setArchivoExcel(e.target.files[0]);
  };

  const handleLeerExcel = () => {
    if (!archivoExcel) return alert("Seleccione un archivo Excel");

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      // Mapeo: extrae los campos esperados
      const mapeado = json.map((row) => ({
        tipo: row["Tipo"]?.toString().trim(),
        cantidad: Number(row["Cant"]) || 1,
        descripcion: row["Descripción"] || "",
        base: Number(row["base"]) || 0,
        altura: Number(row["altura"]) || 0,
      })).filter(t => t.tipo && t.descripcion);

      setListaTipologias(mapeado);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  const handleAgregarManual = () => {
    if (!manual.tipo || !manual.descripcion || !manual.base || !manual.altura) {
      alert("Completa todos los campos");
      return;
    }
    setListaTipologias([...listaTipologias, { ...manual }]);
    setManual({ tipo: "", descripcion: "", base: "", altura: "", cantidad: 1 });
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tipologias/importar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipologias: listaTipologias })
      });

      if (!res.ok) throw new Error("Error al guardar tipologías");
      setMensaje("Tipologías guardadas correctamente");
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      setMensaje("Error al guardar");
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title="Cargar Tipologías">
      <div className={styles.contenedor}>
        <h4>1. Importar desde Excel</h4>
        <input type="file" accept=".xlsx" onChange={handleExcelChange} />
        <button onClick={handleLeerExcel}>📥 Leer Excel</button>

        <hr />

        <h4>2. Agregar Manualmente</h4>
        <div className={styles.formulario}>
          <input
            type="text"
            placeholder="Tipo"
            value={manual.tipo}
            onChange={(e) => setManual({ ...manual, tipo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={manual.descripcion}
            onChange={(e) => setManual({ ...manual, descripcion: e.target.value })}
          />
          <input
            type="number"
            placeholder="Base"
            value={manual.base}
            onChange={(e) => setManual({ ...manual, base: e.target.value })}
          />
          <input
            type="number"
            placeholder="Altura"
            value={manual.altura}
            onChange={(e) => setManual({ ...manual, altura: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={manual.cantidad}
            onChange={(e) => setManual({ ...manual, cantidad: e.target.value })}
          />
          <button onClick={handleAgregarManual}>➕ Agregar</button>
        </div>

        <h4>3. Lista a guardar</h4>
        {listaTipologias.length === 0 && <p>No hay tipologías aún.</p>}
        {listaTipologias.length > 0 && (
          <ul className={styles.lista}>
            {listaTipologias.map((t, idx) => (
              <li key={idx}>
                <strong>{t.tipo}</strong> - {t.descripcion} ({t.base}x{t.altura}) x{t.cantidad}
              </li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          <button onClick={handleGuardar} disabled={listaTipologias.length === 0}>
            Guardar Tipologías
          </button>
        </div>

        {mensaje && <p>{mensaje}</p>}
      </div>
    </ModalBase>
  );
}
