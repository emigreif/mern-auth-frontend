// src/components/modals/modalImportarTipologiasOV.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";
import { useAuth } from "../../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalImportarTipologiasOV({ obra, onClose, onCreated }) {
  const { token } = useAuth();

  const [tipologias, setTipologias] = useState([]);
  const [nuevo, setNuevo] = useState({
    tipo: "",
    descripcion: "",
    base: "",
    altura: "",
    cantidad: 1,
  });
  const [archivoExcel, setArchivoExcel] = useState(null);
  const [search, setSearch] = useState("");

  const handleArchivo = (e) => setArchivoExcel(e.target.files[0]);

  const handleLeerExcel = () => {
    if (!archivoExcel) return alert("Selecciona un archivo Excel");
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      // Lee desde la fila 11 (index 10)
      const json = XLSX.utils.sheet_to_json(sheet, { range: 10 });
      const filas = json
        .map((row) => ({
          tipo: row["Tipo"]?.toString().trim(),
          descripcion: row["Descripción"]?.toString().trim() || "",
          base: Number(row["base"]),
          altura: Number(row["altura"]),
          cantidad: Number(row["Cant"]),
        }))
        .filter((t) => t.tipo && !isNaN(t.base) && !isNaN(t.altura) && !isNaN(t.cantidad));
      setTipologias([...tipologias, ...filas]);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  const handleAgregarManual = () => {
    const { tipo, descripcion, base, altura, cantidad } = nuevo;
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
    setNuevo({ tipo: "", descripcion: "", base: "", altura: "", cantidad: 1 });
  };

  const handleGuardar = async () => {
    if (!tipologias.length) return alert("No hay tipologías para guardar");
    try {
      const res = await fetch(`${API_URL}/api/obras/${obra._id}/perfiles-ov`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipologias: tipologias.map((t) => ({ ...t, obra: obra._id })) }),
      });
      if (!res.ok) throw new Error("Error al guardar tipologías");
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar las tipologías.");
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Cargar Tipologías - ${obra?.nombre || ""}`}>
      <div className={styles.contenedor}>
        {/* Sección Excel */}
        <section className={styles.section}>
          <h3>1. Importar desde Excel</h3>
          <input type="file" accept=".xlsx" onChange={handleArchivo} />
          <Button onClick={handleLeerExcel}>📥 Leer Excel</Button>
        </section>

        <hr />

        {/* Sección Manual */}
        <section className={styles.section}>
          <h3>2. Agregar Manualmente</h3>
          <div className={styles.formulario}>
            <input
              type="text"
              placeholder="Tipo"
              value={nuevo.tipo}
              onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
            />
            <input
              type="text"
              placeholder="Descripción"
              value={nuevo.descripcion}
              onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            />
            <input
              type="number"
              placeholder="Base"
              value={nuevo.base}
              onChange={(e) => setNuevo({ ...nuevo, base: e.target.value })}
            />
            <input
              type="number"
              placeholder="Altura"
              value={nuevo.altura}
              onChange={(e) => setNuevo({ ...nuevo, altura: e.target.value })}
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={nuevo.cantidad}
              onChange={(e) => setNuevo({ ...nuevo, cantidad: e.target.value })}
            />
            <Button onClick={handleAgregarManual}>➕ Agregar</Button>
          </div>
        </section>

        <hr />

        {/* Sección Lista */}
        <section className={styles.section}>
          <h3>3. Lista para Guardar</h3>
          <input
            type="text"
            placeholder="Buscar por código, descripción, color, etc."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <ul className={styles.lista}>
            {tipologias
              .filter((p) =>
                JSON.stringify(p).toLowerCase().includes(search.toLowerCase())
              )
              .map((t, i) => (
                <li key={i}>
                  {t.tipo} - {t.descripcion} ({t.base}x{t.altura}) x{t.cantidad}
                </li>
              ))}
          </ul>
        </section>

        <hr />

        {/* Sección Guardar */}
        <section className={styles.section}>
          <Button onClick={handleGuardar} disabled={tipologias.length === 0}>
            💾 Guardar Tipologías
          </Button>
        </section>
      </div>
    </ModalBase>
  );
}
