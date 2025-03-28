// src/components/modals/modalAsignarVidrio.jsx
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

export default function ModalAsignarVidrio({ isOpen, onClose, obras = [], vidrios = [], API_URL, token, onSuccess }) {
  const [tab, setTab] = useState("manual");
  const [obraSeleccionada, setObraSeleccionada] = useState("");
  const [pedidos, setPedidos] = useState([{ ancho: 0, alto: 0 }]);
  const [errores, setErrores] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [excelRows, setExcelRows] = useState([]);

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const resetForm = () => {
    setTab("manual");
    setPedidos([{ ancho: 0, alto: 0 }]);
    setErrores([]);
    setResultado(null);
    setObraSeleccionada("");
    setExcelRows([]);
  };

  const agregarLinea = () => {
    setPedidos([...pedidos, { ancho: 0, alto: 0 }]);
  };

  const quitarLinea = (i) => {
    const nuevas = [...pedidos];
    nuevas.splice(i, 1);
    setPedidos(nuevas);
  };

  const handleLineaChange = (i, field, value) => {
    const nuevas = [...pedidos];
    nuevas[i][field] = parseInt(value, 10) || 0;
    setPedidos(nuevas);
  };

  const handleAsignarManual = async () => {
    const erroresTemp = [];
    if (!obraSeleccionada) {
      setErrores(["Debes seleccionar una obra"]);
      return;
    }
    pedidos.forEach((p, idx) => {
      if (!p.ancho || !p.alto || p.ancho <= 0 || p.alto <= 0) {
        erroresTemp.push(`Línea ${idx + 1}: medidas inválidas.`);
      }
    });
    if (erroresTemp.length > 0) {
      setErrores(erroresTemp);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/panol/vidrios/asignar-manual`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ obra: obraSeleccionada, items: pedidos })
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
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { range: 11 });
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
      const res = await fetch(`${API_URL}/api/panol/vidrios/asignar-excel`, {
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
    <ModalBase isOpen={isOpen} onClose={onClose} title="Asignar Vidrios a Obra">
      <div className={styles.tabHeader}>
        <Button onClick={() => setTab("manual")} className={tab === "manual" ? styles.active : ""}>
          Carga Manual
        </Button>
        <Button onClick={() => setTab("excel")} className={tab === "excel" ? styles.active : ""}>
          Importar Excel
        </Button>
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
          {pedidos.map((p, i) => (
            <div key={i} className={styles.row}>
              <input
                type="number"
                min={1}
                placeholder="Ancho (mm)"
                value={p.ancho}
                onChange={(e) => handleLineaChange(i, "ancho", e.target.value)}
              />
              <input
                type="number"
                min={1}
                placeholder="Alto (mm)"
                value={p.alto}
                onChange={(e) => handleLineaChange(i, "alto", e.target.value)}
              />
              <Button variant="danger" onClick={() => quitarLinea(i)}>
                ❌
              </Button>
            </div>
          ))}
          <Button onClick={agregarLinea}>➕ Agregar línea</Button>
          <Button className={styles.submitBtn} onClick={handleAsignarManual}>
            Asignar Vidrios
          </Button>
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
                    {row.ancho} mm x {row.alto} mm
                  </li>
                ))}
              </ul>
              <Button className={styles.submitBtn} onClick={handleAsignarDesdeExcel}>
                Asignar desde Excel
              </Button>
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
          {resultado.asignados && <p>✅ Asignados: {resultado.asignados.length}</p>}
          {resultado.faltantes && resultado.faltantes.length > 0 && (
            <>
              <p>❌ Faltantes:</p>
              <ul>
                {resultado.faltantes.map((f, idx) => (
                  <li key={idx}>
                    {f.ancho} mm x {f.alto} mm {f.motivo && `(${f.motivo})`}
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
