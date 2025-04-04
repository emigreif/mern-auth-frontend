import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalUbicaciones({ obra, onClose }) {
  const { token } = useAuth();
  const [pisos, setPisos] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [ubicacionesGeneradas, setUbicacionesGeneradas] = useState([]);

  useEffect(() => {
    if (obra?._id) fetchUbicacionesObra();
  }, [obra]);

  const fetchUbicacionesObra = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ubicaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const filtradas = data.filter((u) => u.obra === obra._id);
      setUbicacionesGeneradas(ordenarUbicaciones(filtradas));
    } catch (err) {
      console.error("Error al obtener ubicaciones:", err);
    }
  };

  const ordenarUbicaciones = (arr) =>
    [...arr].sort((a, b) => {
      const pisoA = parseInt(a.piso.replace(/\D/g, "")) || 0;
      const pisoB = parseInt(b.piso.replace(/\D/g, "")) || 0;
      if (pisoA !== pisoB) return pisoA - pisoB;
      const ubA = parseInt(a.ubicacion.replace(/\D/g, "")) || 0;
      const ubB = parseInt(b.ubicacion.replace(/\D/g, "")) || 0;
      return ubA - ubB;
    });

  const handleAddPiso = () => {
    setPisos((prev) => [...prev, { rango: "", ubicaciones: 1 }]);
  };

  const handleChangePiso = (index, field, value) => {
    setPisos((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const pisoYaExiste = (piso) =>
    ubicacionesGeneradas.some((u) => u.piso.toLowerCase() === piso.toLowerCase());

  const parseRangoPisos = (rango) => {
    return rango.split(",").flatMap((segmento) => {
      if (segmento.includes("-")) {
        const [start, end] = segmento.split("-").map(Number);
        return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());
      }
      return [segmento.trim()];
    });
  };

  const handleGenerar = async () => {
    setErrorMsg("");
    if (!obra?._id) return setErrorMsg("Obra no especificada.");
    if (pisos.length === 0) return setErrorMsg("Agregá al menos un piso.");

    for (let p of pisos) {
      if (!p.rango.trim()) return setErrorMsg("Cada rango de pisos es obligatorio.");
      if (p.ubicaciones <= 0) return setErrorMsg("Ubicaciones debe ser mayor a 0.");
    }

    try {
      for (const pisoConfig of pisos) {
        const rangos = parseRangoPisos(pisoConfig.rango);
        const nuevos = rangos.filter((p) => !pisoYaExiste(`P${p}`));
        if (nuevos.length === 0) continue;

        const res = await fetch(`${API_URL}/api/ubicaciones/generar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            obraId: obra._id,
            pisos: [{ rango: nuevos.join(","), ubicaciones: pisoConfig.ubicaciones }],
          }),
        });

        if (!res.ok) throw new Error(await res.text());
        await fetchUbicacionesObra();
      }
      setPisos([]);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleEliminarPiso = async (piso) => {
    if (!confirm(`¿Eliminar todas las ubicaciones del piso ${piso}?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/ubicaciones/eliminar-por-piso`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ piso, obraId: obra._id }),
      });
      if (!res.ok) throw new Error("Error al eliminar ubicaciones del piso");
      await fetchUbicacionesObra();
    } catch (err) {
      console.error("Error al eliminar piso:", err);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Carga de Ubicaciones - Obra ${obra.nombre}`}>
      {errorMsg && <p style={{ color: "red", marginBottom: "1rem" }}>{errorMsg}</p>}

      {pisos.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Rango (ej: 1-3,5)"
            value={p.rango}
            onChange={(e) => handleChangePiso(i, "rango", e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            type="number"
            placeholder="Cant. Ubicaciones"
            value={p.ubicaciones}
            onChange={(e) =>
              handleChangePiso(i, "ubicaciones", parseInt(e.target.value) || 0)
            }
            style={{ width: 130 }}
          />
        </div>
      ))}

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <Button onClick={handleAddPiso}>+ Agregar Piso</Button>
        <Button onClick={handleGenerar}>Generar Ubicaciones</Button>
      </div>

      <hr />

      <h3 style={{ marginTop: "1rem" }}>Ubicaciones generadas</h3>
      {ubicacionesGeneradas.length === 0 ? (
        <p>No hay ubicaciones aún.</p>
      ) : (
        [...new Set(ubicacionesGeneradas.map((u) => u.piso))].map((piso) => (
          <div key={piso} style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <strong>{piso}</strong>
              <Button variant="danger" onClick={() => handleEliminarPiso(piso)}>
                🗑 Eliminar Piso
              </Button>
            </div>
            <ul style={{ paddingLeft: "1.2rem" }}>
              {ubicacionesGeneradas
                .filter((u) => u.piso === piso)
                .map((u) => (
                  <li key={u._id}>{u.ubicacion}</li>
                ))}
            </ul>
          </div>
        ))
      )}
    </ModalBase>
  );
}
