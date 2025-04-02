import React, { useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import * as XLSX from "xlsx";
import styles from "../../styles/modals/GlobalModal.module.css";

export default function ModalImportarMaterial({ isOpen, onClose, token, API_URL, tipo }) {
  const [items, setItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        range: 10 // empieza desde fila 11 (0-indexed)
      });

      const headers = rawData[0];
      const rows = rawData.slice(1);

      const parsed = rows.map((row) =>
        headers.reduce((obj, col, idx) => {
          obj[col.toLowerCase().trim()] = row[idx];
          return obj;
        }, {})
      );

      setItems(parsed);
    } catch (err) {
      setErrorMsg("Error al leer el archivo Excel.");
      console.error(err);
    }
  };

  const handleChange = (index, key, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index][key] = value;
      return copy;
    });
  };

  const handleDelete = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      for (const item of items) {
        const res = await fetch(`${API_URL}/api/panol/${tipo}s`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(item)
        });

        if (!res.ok) {
          const err = await res.json();
          console.warn("Error con item:", item, err.message);
        }
      }

      onClose();
    } catch (err) {
      console.error("Error de importación:", err);
      setErrorMsg("Error al importar algunos ítems.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={`Importar ${tipo} desde Excel`}>
      <div className={styles.modalForm}>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        <input type="file" accept=".xlsx, .xls" onChange={handleFile} />

        {items.length > 0 && (
          <>
            <div style={{ maxHeight: "400px", overflow: "auto", marginTop: "1rem" }}>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    {Object.keys(items[0]).map((key) => (
                      <th key={key}>{key.toUpperCase()}</th>
                    ))}
                    <th>🗑</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      {Object.keys(item).map((key) => (
                        <td key={key}>
                          <input
                            value={item[key]}
                            onChange={(e) => handleChange(idx, key, e.target.value)}
                          />
                        </td>
                      ))}
                      <td>
                        <Button onClick={() => handleDelete(idx)} variant="danger">
                          🗑
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.actions}>
              <Button onClick={handleImport} disabled={loading}>
                📤 Importar todo
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </>
        )}
      </div>
    </ModalBase>
  );
}
