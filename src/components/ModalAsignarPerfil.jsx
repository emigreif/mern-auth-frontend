import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import styles from "../styles/modals/GlobalModal:module.css";

/**
 * Props:
 * - isOpen
 * - onClose
 * - perfiles (del stock actual)
 * - obras (para seleccionar)
 * - API_URL
 * - token
 * - onSuccess
 */
export default function ModalAsignarPerfil({ isOpen, onClose, perfiles = [], obras = [], API_URL, token, onSuccess }) {
  const [tab, setTab] = useState("manual");

  const [obraSeleccionada, setObraSeleccionada] = useState("");
  const [lineas, setLineas] = useState([{ codigo: "", color: "", cantidad: 0 }]);
  const [errores, setErrores] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelRows, setExcelRows] = useState([]);

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const resetForm = () => {
    setTab("manual");
    setLineas([{ codigo: "", color: "", cantidad: 0 }]);
    setErrores([]);
    setResultado(null);
    setObraSeleccionada("");
    setExcelFile(null);
    setExcelRows([]);
  };

  const agregarLinea = () => {
    setLineas([...lineas, { codigo: "", color: "", cantidad: 0 }]);
  };

  const quitarLinea = (i) => {
    const nuevas = [...lineas];
    nuevas.splice(i, 1);
    setLineas(nuevas);
  };

  const handleLineaChange = (i, field, value) => {
    const nuevas = [...lineas];
    nuevas[i][field] = field === "cantidad" ? parseInt(value, 10) || 0 : value;
    setLineas(nuevas);
  };

  const validarStock = (codigo, color, cantidad) => {
    const perfil = perfiles.find((p) => p.codigo === codigo && p.color === color);
    if (!perfil) return "No encontrado";
    if (perfil.cantidad < cantidad) return `Solo ${perfil.cantidad} en stock`;
    return null;
  };

  const handleAsignarManual = async () => {
    const erroresTemp = [];
    if (!obraSeleccionada) {
      setErrores(["Debes seleccionar una obra"]);
      return;
    }

    lineas.forEach((l, idx) => {
      if (!l.codigo || !l.color || l.cantidad <= 0) {
        erroresTemp.push(`Línea ${idx + 1}: campos inválidos`);
      }
      const errorStock = validarStock(l.codigo, l.color, l.cantidad);
      if (errorStock) erroresTemp.push(`Línea ${idx + 1}: ${errorStock}`);
    });

    if (erroresTemp.length > 0) {
      setErrores(erroresTemp);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/panol/perfiles/asignar-manual`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ obra: obraSeleccionada, items: lineas })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResultado(data);
      onSuccess?.();
    } catch (err) {
      setErrores([err.message]);
    }
  };

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExcelFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { range: 11 }); // fila 12 en adelante
      setExcelRows(rows);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAsignarDesdeExcel = async () => {
    if (!obraSeleccionada) {
      setErrores(["Selecciona una obra antes de importar."]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/panol/perfiles/asignar-excel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ obra: obraSeleccionada, items: excelRows })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResultado(data);
      onSuccess?.();
    } catch (err) {
      setErrores([err.message]);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Asignar Perfiles a Obra">
      <div className={styles.tabHeader}>
        <button onClick={() => setTab("manual")} className={tab === "manual" ? styles.active : ""}>Carga Manual</button>
        <button onClick={() => setTab("excel")} className={tab === "excel" ? styles.active : ""}>Importar Excel</button>
      </div>

      <div className={styles.formGroup}>
        <label>Obra</label>
        <select value={obraSeleccionada} onChange={(e) => setObraSeleccionada(e.target.value)}>
          <option value="">-- Seleccionar Obra --</option>
          {obras.map((o) => (
            <option key={o._id} value={o._id}>{o.nombre}</option>
          ))}
        </select>
      </div>

      {tab === "manual" && (
        <>
          {lineas.map((l, i) => (
            <div key={i} className={styles.row}>
              <select value={l.codigo} onChange={(e) => handleLineaChange(i, "codigo", e.target.value)}>
                <option value="">Código</option>
                {[...new Set(perfiles.map((p) => p.codigo))].map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>

              <select value={l.color} onChange={(e) => handleLineaChange(i, "color", e.target.value)}>
                <option value="">Color</option>
                {[...new Set(perfiles.map((p) => p.color))].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                placeholder="Cantidad"
                value={l.cantidad}
                onChange={(e) => handleLineaChange(i, "cantidad", e.target.value)}
              />

              <button type="button" onClick={() => quitarLinea(i)}>❌</button>
            </div>
          ))}
          <button type="button" onClick={agregarLinea}>➕ Agregar línea</button>
          <button className={styles.submitBtn} onClick={handleAsignarManual}>Asignar Perfiles</button>
        </>
      )}

      {tab === "excel" && (
        <>
          <div className={styles.formGroup}>
            <label>Archivo Excel (.xlsx)</label>
            <input type="file" accept=".xlsx" onChange={handleExcelChange} />
          </div>
          {excelRows.length > 0 && (
            <>
              <p>Vista previa:</p>
              <ul>
                {excelRows.slice(0, 5).map((row, idx) => (
                  <li key={idx}>
                    {row.codigo} - {row.color} - {row.cantidad}
                  </li>
                ))}
              </ul>
              <button className={styles.submitBtn} onClick={handleAsignarDesdeExcel}>Asignar desde Excel</button>
            </>
          )}
        </>
      )}

      {errores.length > 0 && (
        <div className={styles.errorBox}>
          {errores.map((e, idx) => (
            <p key={idx}>{e}</p>
          ))}
        </div>
      )}

      {resultado && (
        <div className={styles.resultadoBox}>
          <h4>Resultado:</h4>
          {resultado.asignados && (
            <p>✅ Asignados correctamente: {resultado.asignados.length}</p>
          )}
          {resultado.faltantes && resultado.faltantes.length > 0 && (
            <>
              <p>❌ Faltantes:</p>
              <ul>
                {resultado.faltantes.map((f, idx) => (
                  <li key={idx}>
                    {f.codigo} - {f.color} (pedidos: {f.cantidad}, stock: {f.stock || 0})
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </ModalBase>
  );
}
