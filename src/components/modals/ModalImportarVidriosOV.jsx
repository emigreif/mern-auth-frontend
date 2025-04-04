// src/components/modals/ModalImportarVidriosOV.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import ErrorText from "../ui/ErrorText.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalImportarVidriosOV({ obra, onClose, onCreated }) {
  const { token } = useAuth();

  const [vidrios, setVidrios] = useState([]);
  const [search, setSearch] = useState("");
  const [nuevo, setNuevo] = useState({
    descripcion: "",
    tipo: "simple",
    ancho: 0,
    alto: 0,
    cantidad: 1,
    tipologia: "",
  });
  const [archivoExcel, setArchivoExcel] = useState(null);

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
          descripcion: row["Descripción"]?.toString().trim() || "",
          tipo: row["Tipo"]?.toString().trim().toLowerCase() || "simple",
          ancho: Number(row["Ancho"]) || 0,
          alto: Number(row["Alto"]) || 0,
          cantidad: Number(row["Cantidad"]) || 0,
          tipologia: row["Tipología"]?.toString().trim() || "",
        }))
        .filter((v) => v.descripcion && v.ancho > 0 && v.alto > 0 && v.cantidad > 0);

      setVidrios((prev) => [...prev, ...filas]);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  const agregarManual = () => {
    const { descripcion, tipo, ancho, alto, cantidad, tipologia } = nuevo;
    if (!descripcion || !ancho || !alto || !cantidad) {
      alert("Campos obligatorios incompletos");
      return;
    }

    setVidrios((prev) => [
      ...prev,
      {
        descripcion: descripcion.trim(),
        tipo: tipo.trim(),
        ancho: Number(ancho),
        alto: Number(alto),
        cantidad: Number(cantidad),
        tipologia: tipologia.trim(),
      },
    ]);

    setNuevo({
      descripcion: "",
      tipo: "simple",
      ancho: 0,
      alto: 0,
      cantidad: 1,
      tipologia: "",
    });
  };

  const guardar = async () => {
    if (!vidrios.length) return alert("No hay vidrios para guardar");
    try {
      const res = await fetch(`${API_URL}/api/obras/${obra._id}/vidrios-ov`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vidrios }),
      });
      if (!res.ok) throw new Error("Error al guardar vidrios");
      onCreated?.();
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
    <ModalBase isOpen={true} onClose={onClose} title={`Importar Vidrios OV - ${obra?.nombre || ""}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Excel */}
        <div>
          <h4>1. Cargar desde Excel</h4>
          <Input type="file" accept=".xlsx" onChange={handleArchivo} />
          <Button onClick={leerExcel}>📥 Leer Excel</Button>
        </div>

        <hr />

        {/* Manual */}
        <div>
          <h4>2. Agregar Manualmente</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem" }}>
            <Input placeholder="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
            <Select
              value={nuevo.tipo}
              onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
              options={["simple", "dvh", "tvh", "laminado"]}
              label="Tipo"
            />
            <Input placeholder="Ancho" type="number" value={nuevo.ancho} onChange={(e) => setNuevo({ ...nuevo, ancho: e.target.value })} />
            <Input placeholder="Alto" type="number" value={nuevo.alto} onChange={(e) => setNuevo({ ...nuevo, alto: e.target.value })} />
            <Input placeholder="Cantidad" type="number" value={nuevo.cantidad} onChange={(e) => setNuevo({ ...nuevo, cantidad: e.target.value })} />
            <Input placeholder="Tipología (opcional)" value={nuevo.tipologia} onChange={(e) => setNuevo({ ...nuevo, tipologia: e.target.value })} />
          </div>
          <Button onClick={agregarManual}>➕ Agregar</Button>
        </div>

        <hr />

        {/* Lista */}
        <div>
          <h4>3. Lista de Vidrios</h4>
          <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <ul>
            {vidriosFiltrados.map((v, i) => (
              <li key={i}>
                {v.descripcion} ({v.ancho}x{v.alto}) - {v.tipo} - {v.cantidad}u {v.tipologia && `- ${v.tipologia}`}
              </li>
            ))}
          </ul>
        </div>

        <hr />

        {/* Guardar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Button onClick={guardar} disabled={vidrios.length === 0}>
            💾 Guardar Vidrios
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
