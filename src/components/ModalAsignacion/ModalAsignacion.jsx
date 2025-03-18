// src/components/ModalAsignacion/ModalAsignacion.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "../ModalBase/ModalBase.jsx";

export default function ModalAsignacion({ obra, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [tipologias, setTipologias] = useState([]); 
  // Estructura supuesta: { _id, codigo, descripcion, cantidad, asignados: 0 }
  const [ubicaciones, setUbicaciones] = useState([]); 
  // Estructura supuesta: { _id, piso, ubicacion, tipologiaId? }

  const [selectedTip, setSelectedTip] = useState(null);

  // Estados de error y carga
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Al montar, cargar tipologías y ubicaciones
  useEffect(() => {
    if (!obra || !obra._id) return;
    fetchData();
  }, [obra]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // GET tipologías
      const resTips = await fetch(`${API_URL}/api/tipologias?obraId=${obra._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resTips.ok) {
        const errData = await resTips.json();
        throw new Error(errData.message || "Error al obtener tipologías");
      }
      const tipData = await resTips.json();

      // GET ubicaciones
      const resUb = await fetch(`${API_URL}/api/ubicaciones?obraId=${obra._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resUb.ok) {
        const errData = await resUb.json();
        throw new Error(errData.message || "Error al obtener ubicaciones");
      }
      const ubData = await resUb.json();

      setTipologias(tipData);
      setUbicaciones(ubData);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Seleccionar una tipología
  const handleSelectTip = (tip) => {
    setSelectedTip(tip);
  };

  // 3. Al hacer clic en una ubicación
  const handleClickUbicacion = (u) => {
    if (!selectedTip) return;

    // Buscamos la ubicación en el array
    const ubIndex = ubicaciones.findIndex((x) => x._id === u._id);
    const updatedArr = [...ubicaciones];

    // Quitar la asignación si ya estaba asignada a la tipología actual
    if (u.tipologiaId === selectedTip._id) {
      updatedArr[ubIndex] = { ...u, tipologiaId: null };
      setUbicaciones(updatedArr);

      // Podrías también decrementar "selectedTip.asignados" si manejas la cuenta
      // EJ: setTipologias(...) para reflejar cambio. (Opcional)
    } 
    // Asignar si la ubicación está libre
    else if (!u.tipologiaId) {
      // (Opcional) Chequear si la tipología tiene “disponible” > 0
      // const disponible = selectedTip.cantidad - (selectedTip.asignados || 0);
      // if (disponible <= 0) return alert("No hay disponibilidad en esta tipología");

      updatedArr[ubIndex] = { ...u, tipologiaId: selectedTip._id };
      setUbicaciones(updatedArr);

      // Podrías también incrementar "selectedTip.asignados" y setTipologias(...) (Opcional)
    }
  };

  // 4. Guardar => POST /api/asociacion => { obraId, asignaciones: [{ ubicacionId, tipologiaId }, ...] }
  const handleGuardar = async () => {
    if (!obra || !obra._id) {
      setErrorMsg("No hay información de la obra para guardar.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      // Filtra solo ubicaciones que tengan tipologiaId
      const asignaciones = ubicaciones
        .filter((u) => u.tipologiaId)
        .map((u) => ({
          ubicacionId: u._id,
          tipologiaId: u.tipologiaId,
        }));

      const body = {
        obraId: obra._id,
        asignaciones,
      };

      const res = await fetch(`${API_URL}/api/asociacion/asignar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar asignaciones");
      }

      // Si todo OK, cierra
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <ModalBase
      isOpen={true}
      onClose={onClose}
      title={`Asignación Tipologías ↔ Ubicaciones - ${obra?.nombre || ""}`}
    >
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {loading && <p style={{ marginBottom: "1rem" }}>Cargando...</p>}

      <div style={{ display: "flex", gap: "1rem" }}>
        {/* Columna Tipologías */}
        <div style={{ flex: 1, border: "1px solid #ccc", padding: "0.5rem" }}>
          <h3>Tipologías</h3>
          {tipologias.map((t) => {
            const disponible = t.cantidad - (t.asignados || 0); // si tu backend lo maneja
            return (
              <button
                key={t._id}
                onClick={() => handleSelectTip(t)}
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  background: selectedTip?._id === t._id ? "#ccc" : "#fff",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {t.codigo} (disp={disponible})
              </button>
            );
          })}
        </div>

        {/* Columna Ubicaciones */}
        <div style={{ flex: 2, border: "1px solid #ccc", padding: "0.5rem" }}>
          <h3>Ubicaciones</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {ubicaciones.map((u) => (
              <button
                key={u._id}
                onClick={() => handleClickUbicacion(u)}
                style={{
                  background: u.tipologiaId ? "#fdd" : "#dfd",
                  width: "80px",
                  height: "40px",
                  border: "1px solid #999",
                  cursor: "pointer",
                }}
              >
                {u.piso}
                {u.ubicacion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
        <button onClick={handleGuardar} disabled={loading}>
          Guardar Asignaciones
        </button>
        <button onClick={onClose} disabled={loading}>
          Cerrar
        </button>
      </div>
    </ModalBase>
  );
}
