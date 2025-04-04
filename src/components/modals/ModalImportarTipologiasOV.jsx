// src/components/modals/ModalImportarTipologiasOV.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import ErrorText from "../ui/ErrorText.jsx";
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
  const [errorMsg, setErrorMsg] = useState("");

  const handleArchivo = (e) => setArchivoExcel(e.target.files[0]);

  const handleLeerExcel = () => {
    if (!archivoExcel) return alert("Selecciona un archivo Excel");
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
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

      setTipologias((prev) => [...prev, ...filas]);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  const handleAgregarManual = () => {
    const { tipo, descripcion, base, altura, cantidad } = nuevo;
    if (!tipo || !descripcion || !base || !altura) {
      setErrorMsg("Completa todos los campos requeridos");
      return;
    }
    setErrorMsg("");
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
      onCreated?.();
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar las tipologías.");
    }
  };

  const tipologiasFiltradas = tipologias.filter((t) =>
    JSON.stringify(t).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Cargar Tipologías - ${obra?.nombre || ""}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <section>
          <h3>1. Importar desde Excel</h3>
          <Input type="file" accept=".xlsx" onChange={handleArchivo} />
          <Button onClick={handleLeerExcel}>📥 Leer Excel</Button>
        </section>

        <hr />

        <section>
          <h3>2. Agregar Manualmente</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <Input
              placeholder="Tipo"
              value={nuevo.tipo}
              onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
            />
            <Input
              placeholder="Descripción"
              value={nuevo.descripcion}
              onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Base"
              value={nuevo.base}
              onChange={(e) => setNuevo({ ...nuevo, base: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Altura"
              value={nuevo.altura}
              onChange={(e) => setNuevo({ ...nuevo, altura: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Cantidad"
              value={nuevo.cantidad}
              onChange={(e) => setNuevo({ ...nuevo, cantidad: e.target.value })}
            />
            <Button onClick={handleAgregarManual}>➕ Agregar</Button>
          </div>
          <ErrorText>{errorMsg}</ErrorText>
        </section>

        <hr />

        <section>
          <h3>3. Lista para Guardar</h3>
          <Input
            placeholder="Buscar por tipo, descripción, etc."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul>
            {tipologiasFiltradas.map((t, i) => (
              <li key={i}>
                {t.tipo} - {t.descripcion} ({t.base}x{t.altura}) x{t.cantidad}
              </li>
            ))}
          </ul>
        </section>

        <hr />

        <section>
          <Button onClick={handleGuardar} disabled={tipologias.length === 0}>
            💾 Guardar Tipologías
          </Button>
        </section>
      </div>
    </ModalBase>
  );
}
