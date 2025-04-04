// src/components/modals/ModalImportarMaterial.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

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
        range: 10, // empieza desde fila 11
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
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(item),
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
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <ErrorText>{errorMsg}</ErrorText>
        <Input type="file" accept=".xlsx, .xls" onChange={handleFile} />

        {items.length > 0 && (
          <>
            <div style={{ maxHeight: 400, overflow: "auto", border: "1px solid #ccc", borderRadius: 4 }}>
              <table style={{ width: "100%", fontSize: "0.9rem", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {Object.keys(items[0]).map((key) => (
                      <th key={key} style={{ padding: "0.3rem", borderBottom: "1px solid #ddd", textAlign: "left" }}>
                        {key.toUpperCase()}
                      </th>
                    ))}
                    <th>🗑</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      {Object.keys(item).map((key) => (
                        <td key={key} style={{ padding: "0.3rem", borderBottom: "1px solid #eee" }}>
                          <input
                            value={item[key]}
                            onChange={(e) => handleChange(idx, key, e.target.value)}
                            style={{ width: "100%", padding: "2px 6px", fontSize: "0.85rem" }}
                          />
                        </td>
                      ))}
                      <td>
                        <Button variant="danger" onClick={() => handleDelete(idx)}>
                          🗑
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
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
