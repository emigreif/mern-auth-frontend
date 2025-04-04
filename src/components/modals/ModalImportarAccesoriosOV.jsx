// src/components/modals/ModalImportarAccesoriosOV.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import ErrorText from "../ui/ErrorText.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalImportarAccesoriosOV({ obra, onClose, onCreated }) {
  const { token } = useAuth();

  const [accesorios, setAccesorios] = useState([]);
  const [archivoExcel, setArchivoExcel] = useState(null);
  const [search, setSearch] = useState("");
  const [nuevo, setNuevo] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 1,
    unidad: "u",
    tipo: "accesorios",
  });
  const [errorMsg, setErrorMsg] = useState("");

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
          unidad: row["Unidad"]?.toString().trim() || "u",
          tipo: row["Tipo"]?.toString().trim() || "accesorios",
        }))
        .filter((a) => a.codigo && a.descripcion && a.cantidad > 0);

      setAccesorios((prev) => [...prev, ...filas]);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  const agregarManual = () => {
    const { codigo, descripcion, cantidad } = nuevo;
    if (!codigo || !descripcion || cantidad <= 0)
      return alert("Completa los campos obligatorios");

    setAccesorios((prev) => [...prev, { ...nuevo, cantidad: Number(nuevo.cantidad) }]);
    setNuevo({
      codigo: "",
      descripcion: "",
      color: "",
      cantidad: 1,
      unidad: "u",
      tipo: "accesorios",
    });
  };

  const guardar = async () => {
    if (!accesorios.length) return alert("No hay accesorios para guardar");

    try {
      const res = await fetch(`${API_URL}/api/obras/${obra._id}/accesorios-ov`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accesorios }),
      });

      if (!res.ok) throw new Error("Error al guardar accesorios");
      onCreated?.();
      onClose();
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg("Error al guardar accesorios");
    }
  };

  const accesoriosFiltrados = accesorios.filter((a) =>
    JSON.stringify(a).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalBase isOpen={true} onClose={onClose} title="Importar Accesorios OV">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <ErrorText>{errorMsg}</ErrorText>

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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" }}>
            <Input placeholder="Código" value={nuevo.codigo} onChange={(e) => setNuevo({ ...nuevo, codigo: e.target.value })} />
            <Input placeholder="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
            <Input placeholder="Color" value={nuevo.color} onChange={(e) => setNuevo({ ...nuevo, color: e.target.value })} />
            <Input type="number" placeholder="Cantidad" value={nuevo.cantidad} onChange={(e) => setNuevo({ ...nuevo, cantidad: e.target.value })} />
            <Input placeholder="Unidad" value={nuevo.unidad} onChange={(e) => setNuevo({ ...nuevo, unidad: e.target.value })} />
            <Select
              value={nuevo.tipo}
              onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
              options={[
                "accesorios",
                "herrajes",
                "tornillos",
                "bulones",
                "felpas",
                "selladores / espuma",
                "otro",
              ]}
            />
          </div>
          <Button onClick={agregarManual}>➕ Agregar</Button>
        </div>

        <hr />

        {/* Lista */}
        <div>
          <h4>3. Lista de Accesorios</h4>
          <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <ul>
            {accesoriosFiltrados.map((a, i) => (
              <li key={i} style={{ fontSize: "0.9rem" }}>
                {a.codigo} - {a.descripcion} - {a.color} - {a.cantidad} {a.unidad} ({a.tipo})
              </li>
            ))}
          </ul>
        </div>

        <hr />

        {/* Guardar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Button onClick={guardar} disabled={accesorios.length === 0}>
            💾 Guardar Accesorios
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
