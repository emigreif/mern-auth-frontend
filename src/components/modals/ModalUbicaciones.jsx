// src/components/modals/modalUbicaciones.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ModalBase from "./ModalBase.jsx";
import Button from "../Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalUbicaciones({ obra, onClose }) {
  const { token } = useAuth();
  const [pisos, setPisos] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [ubicacionesGeneradas, setUbicacionesGeneradas] = useState([]);

  useEffect(() => {
    if (obra?._id) {
      fetchUbicacionesObra();
    }
  }, [obra]);

  const fetchUbicacionesObra = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ubicaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Filtrar solo las ubicaciones de la obra actual
      const filtradas = data.filter((u) => u.obra === obra._id);
      setUbicacionesGeneradas(ordenarUbicaciones(filtradas));
    } catch (err) {
      console.error("Error al obtener ubicaciones:", err);
    }
  };

  const ordenarUbicaciones = (ubicaciones) => {
    return [...ubicaciones].sort((a, b) => {
      const pisoA = parseInt(a.piso.replace(/\D/g, "")) || 0;
      const pisoB = parseInt(b.piso.replace(/\D/g, "")) || 0;
      if (pisoA !== pisoB) return pisoA - pisoB;
      const ubA = parseInt(a.ubicacion.replace(/\D/g, "")) || 0;
      const ubB = parseInt(b.ubicacion.replace(/\D/g, "")) || 0;
      return ubA - ubB;
    });
  };

  const handleAddPiso = () => {
    setPisos([...pisos, { rango: "", ubicaciones: 1 }]);
  };

  const handleChangePiso = (index, field, value) => {
    const updated = [...pisos];
    updated[index][field] = value;
    setPisos(updated);
  };

  const pisoYaExiste = (piso) =>
    ubicacionesGeneradas.some((u) => u.piso.toLowerCase() === piso.toLowerCase());

  const parseRangoPisos = (rango) => {
    const partes = rango.split(",").map((r) => r.trim());
    const pisos = [];
    partes.forEach((parte) => {
      if (parte.includes("-")) {
        const [start, end] = parte.split("-").map(Number);
        for (let i = start; i <= end; i++) {
          pisos.push(i.toString());
        }
      } else {
        pisos.push(parte);
      }
    });
    return pisos;
  };

  const handleGenerar = async () => {
    setErrorMsg("");
    if (!obra || !obra._id) return setErrorMsg("Obra no especificada.");
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
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error al generar ubicaciones: ${text}`);
        }
        await fetchUbicacionesObra();
      }
      setPisos([]);
    } catch (error) {
      console.error("❌ Error:", error);
      setErrorMsg(error.message);
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
    } catch (error) {
      console.error("Error al eliminar piso:", error);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Carga de Ubicaciones - Obra ${obra.nombre}`}>
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <div className={styles.formContainer}>
        {pisos.map((p, i) => (
          <div key={i} className={styles.pisoItem}>
            <input
              type="text"
              placeholder="Rango de pisos (ej: 1-3, 5, 7-9)"
              value={p.rango}
              onChange={(e) => handleChangePiso(i, "rango", e.target.value)}
            />
            <input
              type="number"
              placeholder="Cant. Ubicaciones"
              value={p.ubicaciones}
              onChange={(e) => handleChangePiso(i, "ubicaciones", parseInt(e.target.value) || 0)}
              style={{ width: "120px" }}
            />
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button onClick={handleAddPiso}>+ Agregar Piso</Button>
      </div>

      <div className={styles.actions}>
        <Button onClick={handleGenerar}>Generar Ubicaciones</Button>
      </div>

      <hr />

      <h3>Ubicaciones generadas</h3>
      {ubicacionesGeneradas.length === 0 && <p>No hay ubicaciones aún.</p>}
      {ubicacionesGeneradas.length > 0 && (
        <div className={styles.listaPisos}>
          {[...new Set(ubicacionesGeneradas.map((u) => u.piso))].map((piso) => (
            <div key={piso} className={styles.pisoGrupo}>
              <div className={styles.pisoHeader}>
                <strong>{piso}</strong>
                <Button variant="danger" onClick={() => handleEliminarPiso(piso)}>
                  🗑 Eliminar Piso
                </Button>
              </div>
              <ul>
                {ubicacionesGeneradas
                  .filter((u) => u.piso === piso)
                  .map((u) => (
                    <li key={u._id}>{u.ubicacion}</li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </ModalBase>
  );
}
