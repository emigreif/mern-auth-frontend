import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import styles from "../styles/modals/ModalImportarTipologias.module.css";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * ModalImportarTipologias:
 * - Carga manual o por Excel desde fila 11.
 * - Reutilizable para tipologías reales o tipologíasOV.
 */
export default function ModalImportarTipologias({
  obra,
  endpoint,
  titulo = "Cargar Tipologías",
  onClose,
  onSaved,
}) {
  const { token } = useAuth();
  const [archivoExcel, setArchivoExcel] = useState(null);
  const [tipologias, setTipologias] = useState([]);
  const [manual, setManual] = useState({
    tipo: "",
    descripcion: "",
    base: "",
    altura: "",
    cantidad: 1,
  });

  const handleExcelChange = (e) => setArchivoExcel(e.target.files[0]);

  const handleLeerExcel = () => {
    if (!archivoExcel) return alert("Selecciona un archivo Excel");

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { range: 10 });

      const rows = json
        .map((row) => ({
          tipo: row["Tipo"]?.toString().trim(),
          descripcion: row["Descripción"]?.toString().trim() || "",
          base: Number(row["base"]),
          altura: Number(row["altura"]),
          cantidad: Number(row["Cant"]),
        }))
        .filter((t) => t.tipo && !isNaN(t.base) && !isNaN(t.altura) && !isNaN(t.cantidad));

      setTipologias(rows);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  const handleAgregarManual = () => {
    const { tipo, descripcion, base, altura, cantidad } = manual;
    if (!tipo || !descripcion || !base || !altura) {
      alert("Completa todos los campos requeridos");
      return;
    }

    setTipologias((prev) => [
      ...prev,
      {
        tipo,
        descripcion,
        base: Number(base),
        altura: Number(altura),
        cantidad: Number(cantidad),
      },
    ]);

    setManual({ tipo: "", descripcion: "", base: "", altura: "", cantidad: 1 });
  };

  const handleGuardar = async () => {
    const datos = tipologias.map((t) => ({ ...t, obra: obra._id }));

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipologias: datos }),
      });

      if (!res.ok) throw new Error("Error al guardar tipologías");

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar las tipologías.");
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`${titulo} - ${obra?.nombre || ""}`}>
      <div className={styles.contenedor}>
        <section>
          <h3>1. Importar desde Excel</h3>
          <input type="file" accept=".xlsx" onChange={handleExcelChange} />
          <button onClick={handleLeerExcel}>📥 Leer Excel</button>
        </section>

        <hr />

        <section>
          <h3>2. Agregar Manualmente</h3>
          <div className={styles.formulario}>
            <input type="text" placeholder="Tipo" value={manual.tipo} onChange={(e) => setManual({ ...manual, tipo: e.target.value })} />
            <input type="text" placeholder="Descripción" value={manual.descripcion} onChange={(e) => setManual({ ...manual, descripcion: e.target.value })} />
            <input type="number" placeholder="Base" value={manual.base} onChange={(e) => setManual({ ...manual, base: e.target.value })} />
            <input type="number" placeholder="Altura" value={manual.altura} onChange={(e) => setManual({ ...manual, altura: e.target.value })} />
            <input type="number" placeholder="Cantidad" value={manual.cantidad} onChange={(e) => setManual({ ...manual, cantidad: e.target.value })} />
            <button onClick={handleAgregarManual}>➕ Agregar</button>
          </div>
        </section>

        <hr />

        <section>
          <h3>3. Lista para Guardar</h3>
          <ul className={styles.lista}>
            {tipologias.map((t, i) => (
              <li key={i}>
                {t.tipo} - {t.descripcion} ({t.base}x{t.altura}) x{t.cantidad}
              </li>
            ))}
          </ul>
          <button onClick={handleGuardar} disabled={tipologias.length === 0}>
            💾 Guardar Tipologías
          </button>
        </section>
      </div>
    </ModalBase>
  );
}
