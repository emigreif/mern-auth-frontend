import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import styles from "../styles/modals/GlobalModal.module.css";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalImportarPerfilesOV({ obra, onClose, onCreated }) {
  const { token } = useAuth();

  const [perfiles, setPerfiles] = useState([]);
  const [nuevo, setNuevo] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 1,
    largo: 0,
    pesoxmetro: 0
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
          codigo: row["Código"]?.toString().trim() || "",
          descripcion: row["Descripción"]?.toString().trim() || "",
          color: row["Color"]?.toString().trim() || "",
          cantidad: Number(row["Cantidad"]) || 0,
          largo: Number(row["Largo"]) || 0,
          pesoxmetro: Number(row["Peso x metro"]) || 0
        }))
        .filter((p) => p.codigo && p.cantidad > 0 && p.largo > 0);

      setPerfiles([...perfiles, ...filas]);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  const agregarManual = () => {
    const { codigo, descripcion, color, cantidad, largo, pesoxmetro } = nuevo;
    if (!codigo || !cantidad || !largo) return alert("Completa los campos obligatorios");

    const perfil = {
      codigo: codigo.trim(),
      descripcion: descripcion.trim(),
      color: color.trim(),
      cantidad: Number(cantidad),
      largo: Number(largo),
      pesoxmetro: Number(pesoxmetro)
    };
    setPerfiles([...perfiles, perfil]);
    setNuevo({
      codigo: "",
      descripcion: "",
      color: "",
      cantidad: 1,
      largo: 0,
      pesoxmetro: 0
    });
  };

  const guardar = async () => {
    if (!perfiles.length) return alert("No hay perfiles para guardar");

    try {
      const res = await fetch(`${API_URL}/api/obras/${obra._id}/perfiles-ov`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ perfiles })
      });

      if (!res.ok) throw new Error("Error al guardar perfiles");

      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Error:", err);
      alert("Error al guardar perfiles");
    }
  };

  const perfilesFiltrados = perfiles.filter((p) =>
    JSON.stringify(p).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalBase isOpen={true} onClose={onClose} title="Importar Perfiles OV">
      <div className={styles.container}>
        {/* Importar desde Excel */}
        <section className={styles.section}>
          <h3>1. Cargar desde Excel</h3>
          <input type="file" accept=".xlsx" onChange={handleArchivo} />
          <button onClick={leerExcel}>📥 Leer Excel</button>
        </section>

        <hr />

        {/* Agregar Manual */}
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
              type="number"
              placeholder="Largo (mm)"
              value={nuevo.largo}
              onChange={(e) => setNuevo({ ...nuevo, largo: e.target.value })}
            />
            <input
              type="number"
              placeholder="Peso x metro (kg)"
              value={nuevo.pesoxmetro}
              onChange={(e) => setNuevo({ ...nuevo, pesoxmetro: e.target.value })}
            />
            <button onClick={agregarManual}>➕ Agregar</button>
          </div>
        </section>

        <hr />

        {/* Buscar y ver lista */}
        <section className={styles.section}>
          <h3>3. Lista de Perfiles</h3>
          <input
            type="text"
            placeholder="Buscar por código, descripción, color, etc."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <ul className={styles.list}>
            {perfilesFiltrados.map((p, i) => (
              <li key={i}>
                {p.codigo} - {p.descripcion} - {p.color} - {p.cantidad}u - {p.largo}mm - {p.pesoxmetro}kg/m
              </li>
            ))}
          </ul>
        </section>

        <hr />

        {/* Guardar */}
        <section className={styles.section}>
          <button onClick={guardar} disabled={perfiles.length === 0}>
            💾 Guardar Perfiles
          </button>
        </section>
      </div>
    </ModalBase>
  );
}
