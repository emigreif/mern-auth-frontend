// src/components/modals/ModalAsignacion.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ModalAsignacion({ obra, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [tipologias, setTipologias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!obra || !obra._id) return;
    fetchData();
  }, [obra]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const [resTips, resUb] = await Promise.all([
        fetch(`${API_URL}/api/tipologias?obraId=${obra._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/ubicaciones?obraId=${obra._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!resTips.ok || !resUb.ok) throw new Error("Error al obtener datos");

      const tipData = await resTips.json();
      const ubData = await resUb.json();

      setTipologias(tipData);
      setUbicaciones(ubData);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTip = (tip) => {
    setSelectedTip(tip);
  };

  const handleClickUbicacion = (u) => {
    if (!selectedTip) return;
    const ubIndex = ubicaciones.findIndex((x) => x._id === u._id);
    const updatedArr = [...ubicaciones];

    if (u.tipologiaId === selectedTip._id) {
      updatedArr[ubIndex] = { ...u, tipologiaId: null };
    } else if (!u.tipologiaId) {
      updatedArr[ubIndex] = { ...u, tipologiaId: selectedTip._id };
    }

    setUbicaciones(updatedArr);
  };

  const handleGuardar = async () => {
    if (!obra || !obra._id) return setErrorMsg("Falta ID de obra");

    try {
      setLoading(true);
      const asignaciones = ubicaciones
        .filter((u) => u.tipologiaId)
        .map((u) => ({
          ubicacionId: u._id,
          tipologiaId: u.tipologiaId,
        }));

      const res = await fetch(`${API_URL}/api/asociacion/asignar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ obraId: obra._id, asignaciones }),
      });

      if (!res.ok) throw new Error("Error al guardar asignaciones");
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={`Asignar Tipologías - ${obra?.nombre || ""}`}>
      <ErrorText>{errorMsg}</ErrorText>
      {loading && <p>Cargando...</p>}

      <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
        {/* Tipologías */}
        <div style={{ flex: 1 }}>
          <h3>Tipologías</h3>
          {tipologias.map((t) => {
            const disponible = t.cantidad - (t.asignados || 0);
            const isActive = selectedTip?._id === t._id;

            return (
              <Button
                key={t._id}
                variant={isActive ? "primary" : "light"}
                onClick={() => handleSelectTip(t)}
                fullWidth
              >
                {t.codigo} (disp={disponible})
              </Button>
            );
          })}
        </div>

        {/* Ubicaciones */}
        <div style={{ flex: 2 }}>
          <h3>Ubicaciones</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {ubicaciones.map((u) => (
              <Button
                key={u._id}
                variant={u.tipologiaId ? "success" : "light"}
                onClick={() => handleClickUbicacion(u)}
                style={{ width: 70 }}
              >
                {u.piso}{u.ubicacion}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem" }}>
        <Button onClick={handleGuardar} disabled={loading}>Guardar</Button>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
      </div>
    </ModalBase>
  );
}
