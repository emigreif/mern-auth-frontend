import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import styles from "../styles/modals/ModalImportarOV.module.css";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalImportarVidriosOV({ obra, onClose, onCreated }) {
  const { token } = useAuth();

  const [vidrios, setVidrios] = useState([]);
  const [nuevo, setNuevo] = useState({
    descripcion: "",
    tipo: "simple",
    ancho: 0,
    alto: 0,
    cantidad: 1,
    tipologia: ""
  });

  const [archivoExcel, setArchivoExcel] = useState(null);
  const [search, setSearch] = useState("");

  const handleArchivo = (e) => setArchivoExcel(e.target.files[0]);

  const leerExcel = () => {
    if (!archivoExcel) return alert("Selecciona un archivo Excel");

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { range: 10 }); // desde fila 11

      const filas = json
        .map((row) => ({
          descripcion: row["Descripción"]?.toString().trim() || "",
          tipo: row["Tipo"]?.toString().trim().toLowerCase() || "simple",
          ancho: Number(row["Ancho"]) || 0,
          alto: Number(row["Alto"]) || 0,
          cantidad: Number(row["Cantidad"]) || 0,
          tipologia: row["Tipología"]?.toString().trim() || ""
        }))
        .filter((v) => v.descripcion && v.ancho > 0 && v.alto > 0 && v.cantidad > 0);

      setVidrios([...vidrios, ...filas]);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  const agregarManual = () => {
    const { descripcion, tipo, ancho, alto, cantidad, tipologia } = nuevo;
    if (!descripcion || !ancho || !alto || !cantidad) return alert("Campos obligatorios incompletos");

    const vidrio = {
      descripcion: descripcion.trim(),
      tipo: tipo || "simple",
      ancho: Number(ancho),
      alto: Number(alto),
      cantidad: Number(cantidad),
      tipologia: tipologia.trim()
    };
    setVidrios([...vidrios, vidrio]);
    setNuevo({ descripcion: "", tipo: "simple", ancho: 0, alto: 0, cantidad: 1, tipologia: "" });
  };

  const guardar = async () => {
    if (!vidrios.length) return alert("No hay vidrios para guardar");

    try {
      const res = await fetch(`${API_URL}/api/obras/${obra._id}/vidrios-ov`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ vidrios })
      });

      if (!res.ok) throw new Error("Error al guardar vidrios");

      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Error:", err);
      alert("Error al guardar vidrios");
    }
  };

  const vidriosFiltrados = vidrios.filter((v) =>
    JSON.stringify(v).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalBase isOpen={true} onClose={onClose} title="Importar Vidrios OV">
      <div className={styles.container}>
        {/* Excel */}
        <section className={styles.section}>
          <h3>1. Cargar desde Excel</h3>
          <input type="file" accept=".xlsx" onChange={handleArchivo} />
          <button onClick={leerExcel}>📥 Leer Excel</button>
        </section>

        <hr />

        {/* Manual */}
        <section className={styles.section}>
          <h3>2. Agregar Manualmente</h3>
          <div className={styles.form}>
            <input type="text" placeholder="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
            <select value={nuevo.tipo} onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}>
              <option value="simple">Simple</option>
              <option value="dvh">DVH</option>
              <option value="tvh">TVH</option>
              <option value="laminado">Laminado</option>
            </select>
            <input type="number" placeholder="Ancho" value={nuevo.ancho} onChange={(e) => setNuevo({ ...nuevo, ancho: e.target.value })} />
            <input type="number" placeholder="Alto" value={nuevo.alto} onChange={(e) => setNuevo({ ...nuevo, alto: e.target.value })} />
            <input type="number" placeholder="Cantidad" value={nuevo.cantidad} onChange={(e) => setNuevo({ ...nuevo, cantidad: e.target.value })} />
            <input type="text" placeholder="Tipología" value={nuevo.tipologia} onChange={(e) => setNuevo({ ...nuevo, tipologia: e.target.value })} />
            <button onClick={agregarManual}>➕ Agregar</button>
          </div>
        </section>

        <hr />

        {/* Lista */}
        <section className={styles.section}>
          <h3>3. Lista de Vidrios</h3>
          <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchInput} />
          <ul className={styles.list}>
            {vidriosFiltrados.map((v, i) => (
              <li key={i}>
                {v.descripcion} ({v.ancho}x{v.alto}) - {v.tipo} - {v.cantidad}u {v.tipologia && `- ${v.tipologia}`}
              </li>
            ))}
          </ul>
        </section>

        <hr />

        {/* Guardar */}
        <section className={styles.section}>
          <button onClick={guardar} disabled={vidrios.length === 0}>
            💾 Guardar Vidrios
          </button>
        </section>
      </div>
    </ModalBase>
  );
}
