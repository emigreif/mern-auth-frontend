import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

export default function ModalPlanillaMedicion({ obra, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!obra || !obra._id) return;
    fetchMediciones();
  }, [obra]);

  const fetchMediciones = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`${API_URL}/api/mediciones?obraId=${obra._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al obtener mediciones");
      }
      const data = await res.json();
      setDatos(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...datos];
    updated[index][field] = value;
    setDatos(updated);
  };

  const handleGuardar = async () => {
    if (!obra || !obra._id) {
      setErrorMsg("No se puede guardar: no hay información de la obra.");
      return;
    }
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      const res = await fetch(`${API_URL}/api/mediciones/masivo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          obraId: obra._id,
          mediciones: datos
        })
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al guardar mediciones");
      }
      await res.json();
      setSuccessMsg("Mediciones guardadas correctamente");
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Planilla de Medición - ${obra?.nombre || ""}`}>
      {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {loading && <p>Cargando...</p>}

      {!loading && datos.map((d, i) => (
        <div key={d._id || i} style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
          <p>
            <strong>{d.piso}{d.ubicacion} - {d.tipologia?.codigo}</strong>{" "}
            ({d.tipologia?.ancho} x {d.tipologia?.alto})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label>
              Ancho Medido:
              <input
                type="number"
                value={d.anchoMedido || ""}
                onChange={(e) => handleChange(i, "anchoMedido", parseFloat(e.target.value) || 0)}
              />
            </label>
            <label>
              Alto Medido:
              <input
                type="number"
                value={d.altoMedido || ""}
                onChange={(e) => handleChange(i, "altoMedido", parseFloat(e.target.value) || 0)}
              />
            </label>
            <label>
              Observaciones:
              <input
                type="text"
                value={d.observaciones || ""}
                onChange={(e) => handleChange(i, "observaciones", e.target.value)}
              />
            </label>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
        <Button onClick={handleGuardar} disabled={loading}>Guardar</Button>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cerrar</Button>
      </div>
    </ModalBase>
  );
}
