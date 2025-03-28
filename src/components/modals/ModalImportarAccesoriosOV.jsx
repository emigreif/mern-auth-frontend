// src/components/modals/modalImportarAccesoriosOV.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import Button from "./Button.jsx";
import styles from "../styles/modals/GlobalModal.module.css";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalImportarAccesoriosOV({ obra, onClose, onCreated }) {
  const { token } = useAuth();

  const [accesorios, setAccesorios] = useState([]);
  const [nuevo, setNuevo] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 1,
    unidad: "u",
    tipo: "accesorios"
  });

  const [archivoExcel, setArchivoExcel] = useState(null);
  const [search, setSearch] = useState("");

  // Manejo de archivo Excel
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
          codigo: row["Código"]?.toString().trim() || "",
          descripcion: row["Descripción"]?.toString().trim() || "",
          color: row["Color"]?.toString().trim() || "",
          cantidad: Number(row["Cantidad"]) || 0,
          unidad: row["Unidad"]?.toString().trim() || "u",
          tipo: row["Tipo"]?.toString().trim() || "accesorios"
        }))
        .filter((a) => a.codigo && a.descripcion && a.cantidad > 0);

      setAccesorios([...accesorios, ...filas]);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  // Agregar accesorio manualmente
  const agregarManual = () => {
    const { codigo, descripcion, color, cantidad, unidad, tipo } = nuevo;
    if (!codigo || !descripcion || cantidad <= 0)
      return alert("Completa los campos obligatorios");

    setAccesorios([
      ...accesorios,
      {
        codigo: codigo.trim(),
        descripcion: descripcion.trim(),
        color: color?.trim(),
        cantidad: Number(cantidad),
        unidad: unidad?.trim() || "u",
        tipo: tipo || "accesorios"
      }
    ]);
    setNuevo({
      codigo: "",
      descripcion: "",
      color: "",
      cantidad: 1,
      unidad: "u",
      tipo: "accesorios"
    });
  };

  // Guardar accesorios importados
  const guardar = async () => {
    if (!accesorios.length) return alert("No hay accesorios para guardar");

    try {
      const res = await fetch(`${API_URL}/api/obras/${obra._id}/accesorios-ov`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accesorios })
      });
      if (!res.ok) throw new Error("Error al guardar accesorios");
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Error:", err);
      alert("Error al guardar accesorios");
    }
  };

  // Filtrado de accesorios para la vista previa
  const accesoriosFiltrados = accesorios.filter((a) =>
    JSON.stringify(a).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalBase isOpen={true} onClose={onClose} title="Importar Accesorios OV">
      <div className={styles.container}>
        {/* Sección Excel */}
        <section className={styles.section}>
          <h3>1. Cargar desde Excel</h3>
          <input type="file" accept=".xlsx" onChange={handleArchivo} />
          <Button onClick={leerExcel}>📥 Leer Excel</Button>
        </section>

        <hr />

        {/* Sección Manual */}
        <section className={styles.section}>
          <h3>2. Agregar Manualmente</h3>
          <div className={styles.form}>
            <input
              type="text"
              placeholder="Código"
              value={nuevo.codigo}
              onChange={(e) => setNuevo({ ...nuevo, codigo: e.target.value })}
            />
            <input
              type="text"
              placeholder="Descripción"
              value={nuevo.descripcion}
              onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            />
            <input
              type="text"
              placeholder="Color"
              value={nuevo.color}
              onChange={(e) => setNuevo({ ...nuevo, color: e.target.value })}
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={nuevo.cantidad}
              onChange={(e) => setNuevo({ ...nuevo, cantidad: e.target.value })}
            />
            <input
              type="text"
              placeholder="Unidad"
              value={nuevo.unidad}
              onChange={(e) => setNuevo({ ...nuevo, unidad: e.target.value })}
            />
            <select
              value={nuevo.tipo}
              onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
            >
              <option value="accesorios">Accesorios</option>
              <option value="herrajes">Herrajes</option>
              <option value="tornillos">Tornillos</option>
              <option value="bulones">Bulones</option>
              <option value="felpas">Felpas</option>
              <option value="selladores / espuma">Selladores / Espuma</option>
              <option value="otro">Otro</option>
            </select>
            <Button onClick={agregarManual}>➕ Agregar</Button>
          </div>
        </section>

        <hr />

        {/* Sección Lista */}
        <section className={styles.section}>
          <h3>3. Lista de Accesorios</h3>
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <ul className={styles.list}>
            {accesoriosFiltrados.map((a, i) => (
              <li key={i}>
                {a.codigo} - {a.descripcion} - {a.color} - {a.cantidad} {a.unidad} ({a.tipo})
              </li>
            ))}
          </ul>
        </section>

        <hr />

        {/* Sección Guardar */}
        <section className={styles.section}>
          <Button onClick={guardar} disabled={accesorios.length === 0}>
            💾 Guardar Accesorios
          </Button>
        </section>
      </div>
    </ModalBase>
  );
}
