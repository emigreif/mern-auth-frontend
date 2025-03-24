// src/components/ModalTipologias.jsx
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase";
import styles from "../styles/modals/ModalTipologias.module.css";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalTipologias({ obra, onClose, onCreated }) {
  const { token } = useAuth();
  const [archivoExcel, setArchivoExcel] = useState(null);
  const [tipologiasExcel, setTipologiasExcel] = useState([]);
  const [tipologiasObra, setTipologiasObra] = useState([]);
  const [manual, setManual] = useState({
    tipo: "",
    descripcion: "",
    base: "",
    altura: "",
    cantidad: 1,
  });

  const [seleccionadasAgrupar, setSeleccionadasAgrupar] = useState([]);
  const [agrupacionNueva, setAgrupacionNueva] = useState({
    tipo: "",
    descripcion: "",
    base: "",
    altura: "",
  });

  useEffect(() => {
    if (obra?._id) fetchTipologiasDeObra();
  }, [obra]);

  const fetchTipologiasDeObra = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tipologias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const filtradas = data.filter((t) => t.obra._id === obra._id);
      setTipologiasObra(filtradas);
    } catch (err) {
      console.error("Error al obtener tipologías de la obra", err);
    }
  };

  const handleExcelChange = (e) => setArchivoExcel(e.target.files[0]);

  const handleLeerExcel = () => {
    if (!archivoExcel) return alert("Selecciona un archivo Excel");

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { range: 10 }); // Empieza desde fila 11 (índice base 0)

      const tipologias = json
        .map((row) => ({
          tipo: row["Tipo"]?.toString().trim(),
          descripcion: row["Descripción"]?.toString().trim() || "",
          base: Number(row["base"]),
          altura: Number(row["altura"]),
          cantidad: Number(row["Cant"]),
        }))
        .filter((t) => t.tipo && !isNaN(t.base) && !isNaN(t.altura) && !isNaN(t.cantidad));

      setTipologiasExcel(tipologias);
    };
    reader.readAsArrayBuffer(archivoExcel);
  };

  const handleAgregarManual = () => {
    const { tipo, descripcion, base, altura, cantidad } = manual;
    if (!tipo || !descripcion || !base || !altura) return alert("Completa todos los campos");

    setTipologiasExcel([...tipologiasExcel, { ...manual, base: Number(base), altura: Number(altura), cantidad: Number(cantidad) }]);
    setManual({ tipo: "", descripcion: "", base: "", altura: "", cantidad: 1 });
  };

  const handleGuardar = async () => {
    const datos = tipologiasExcel.map((t) => ({
      ...t,
      obra: obra._id,
    }));

    console.log("Enviando tipologías al backend:", datos);

    try {
      const res = await fetch(`${API_URL}/api/tipologias/importar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipologias: datos }),
      });

      if (!res.ok) throw new Error("Error al guardar tipologías");
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleAgrupar = async () => {
    const body = {
      tipo: agrupacionNueva.tipo,
      descripcion: agrupacionNueva.descripcion,
      base: Number(agrupacionNueva.base),
      altura: Number(agrupacionNueva.altura),
      origenes: seleccionadasAgrupar,
      obra: obra._id,
    };

    console.log("Agrupando:", body);

    try {
      const res = await fetch(`${API_URL}/api/tipologias/agrupar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al agrupar tipologías");
      fetchTipologiasDeObra(); // Recarga
      setSeleccionadasAgrupar([]);
      setAgrupacionNueva({ tipo: "", descripcion: "", base: "", altura: "" });
    } catch (error) {
      console.error("Error al agrupar:", error);
    }
  };

  const toggleSeleccion = (id) => {
    setSeleccionadasAgrupar((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Cargar Tipologías - Obra ${obra?.nombre}`}>
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
            {tipologiasExcel.map((t, i) => (
              <li key={i}>{t.tipo} - {t.descripcion} ({t.base}x{t.altura}) x{t.cantidad}</li>
            ))}
          </ul>
          <button onClick={handleGuardar} disabled={tipologiasExcel.length === 0}>💾 Guardar Tipologías</button>
        </section>

        <hr />

        <section>
          <h3>4. Agrupar Tipologías Existentes</h3>
          <div className={styles.existingList}>
            {tipologiasObra.map((t) => (
              <label key={t._id} className={styles.tipologiaItem}>
                <input
                  type="checkbox"
                  checked={seleccionadasAgrupar.includes(t._id)}
                  onChange={() => toggleSeleccion(t._id)}
                />
                {t.tipo} - {t.descripcion}
              </label>
            ))}
          </div>

          <div className={styles.formulario}>
            <input type="text" placeholder="Nuevo Tipo" value={agrupacionNueva.tipo} onChange={(e) => setAgrupacionNueva({ ...agrupacionNueva, tipo: e.target.value })} />
            <input type="text" placeholder="Descripción agrupada" value={agrupacionNueva.descripcion} onChange={(e) => setAgrupacionNueva({ ...agrupacionNueva, descripcion: e.target.value })} />
            <input type="number" placeholder="Base" value={agrupacionNueva.base} onChange={(e) => setAgrupacionNueva({ ...agrupacionNueva, base: e.target.value })} />
            <input type="number" placeholder="Altura" value={agrupacionNueva.altura} onChange={(e) => setAgrupacionNueva({ ...agrupacionNueva, altura: e.target.value })} />
            <button onClick={handleAgrupar} disabled={seleccionadasAgrupar.length < 2}>🤝 Agrupar</button>
          </div>
        </section>
      </div>
    </ModalBase>
  );
}
