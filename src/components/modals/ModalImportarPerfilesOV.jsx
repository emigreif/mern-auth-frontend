// src/components/modals/ModalImportarPerfilesOV.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Select from "../ui/Select.jsx";
import ErrorText from "../ui/ErrorText.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalImportarPerfilesOV({ obra, onClose, onCreated }) {
  const { token } = useAuth();

  const [perfiles, setPerfiles] = useState([]);
  const [archivoExcel, setArchivoExcel] = useState(null);
  const [search, setSearch] = useState("");
  const [nuevo, setNuevo] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 1,
    largo: 0,
    pesoxmetro: 0,
  });

  const handleArchivo = (e) => setArchivoExcel(e.target.files[0]);

  const leerExcel = () => {
    if (!archivoExcel) return alert("Selecciona un archivo Excel");
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { range: 10 });

      const filas = json
        .map((row) => ({
          codigo: row["Código"]?.toString().trim() || "",
          descripcion: row["Descripción"]?.toString().trim() || "",
          color: row["Color"]?.toString().trim() || "",
          cantidad: Number(row["Cantidad"]) || 0,
          largo: Number(row["Largo"]) || 0,
          pesoxmetro: Number(row["Peso x metro"]) || 0,
        }))
        .filter((p) => p.codigo && p.cantidad > 0 && p.largo > 0);

      setPerfiles((prev) => [...prev, ...filas]);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  const agregarManual = () => {
    const { codigo, descripcion, color, cantidad, largo, pesoxmetro } = nuevo;
    if (!codigo || !descripcion || cantidad <= 0 || largo <= 0)
      return alert("Completa los campos obligatorios");

    const perfil = {
      codigo: codigo.trim(),
      descripcion: descripcion.trim(),
      color: color.trim(),
      cantidad: Number(cantidad),
      largo: Number(largo),
      pesoxmetro: Number(pesoxmetro),
    };
    setPerfiles((prev) => [...prev, perfil]);
    setNuevo({
      codigo: "",
      descripcion: "",
      color: "",
      cantidad: 1,
      largo: 0,
      pesoxmetro: 0,
    });
  };

  const guardar = async () => {
    if (!perfiles.length) return alert("No hay perfiles para guardar");

    try {
      const res = await fetch(`${API_URL}/api/obras/${obra._id}/perfiles-ov`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ perfiles }),
      });
      if (!res.ok) throw new Error("Error al guardar perfiles");
      onCreated?.();
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
    <ModalBase isOpen={true} onClose={onClose} title={`Importar Perfiles OV - ${obra?.nombre || ""}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Sección Excel */}
        <div>
          <h4>1. Cargar desde Excel</h4>
          <Input type="file" accept=".xlsx" onChange={handleArchivo} />
          <Button onClick={leerExcel}>📥 Leer Excel</Button>
        </div>

        <hr />

        {/* Sección Manual */}
        <div>
          <h4>2. Agregar Manualmente</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" }}>
            <Input placeholder="Código" value={nuevo.codigo} onChange={(e) => setNuevo({ ...nuevo, codigo: e.target.value })} />
            <Input placeholder="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
            <Input placeholder="Color" value={nuevo.color} onChange={(e) => setNuevo({ ...nuevo, color: e.target.value })} />
            <Input placeholder="Cantidad" type="number" value={nuevo.cantidad} onChange={(e) => setNuevo({ ...nuevo, cantidad: e.target.value })} />
            <Input placeholder="Largo (mm)" type="number" value={nuevo.largo} onChange={(e) => setNuevo({ ...nuevo, largo: e.target.value })} />
            <Input placeholder="Peso x metro (kg)" type="number" value={nuevo.pesoxmetro} onChange={(e) => setNuevo({ ...nuevo, pesoxmetro: e.target.value })} />
          </div>
          <Button onClick={agregarManual}>➕ Agregar</Button>
        </div>

        <hr />

        {/* Lista */}
        <div>
          <h4>3. Lista de Perfiles</h4>
          <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <ul>
            {perfilesFiltrados.map((p, i) => (
              <li key={i}>
                {p.codigo} - {p.descripcion} - {p.color} - {p.cantidad}u - {p.largo}mm - {p.pesoxmetro}kg/m
              </li>
            ))}
          </ul>
        </div>

        <hr />

        {/* Guardar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Button onClick={guardar} disabled={perfiles.length === 0}>
            💾 Guardar Perfiles
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
