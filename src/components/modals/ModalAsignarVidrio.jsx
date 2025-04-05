import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

export default function ModalAsignarVidrio({ isOpen, onClose, onSave, token, API_URL }) {
  const [obras, setObras] = useState([]);
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [obraId, setObraId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setObras(data || []);
      } catch (error) {
        console.error("Error al cargar obras:", error);
      }
    };

    fetchObras();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const anchoNum = parseFloat(ancho);
    const altoNum = parseFloat(alto);

    if (!obraId || !anchoNum || !altoNum || anchoNum <= 0 || altoNum <= 0) {
      setErrorMsg("Todos los campos son obligatorios y deben ser válidos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/panol/vidrios/asignar-manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          obra: obraId,
          items: [{ ancho: anchoNum, alto: altoNum }],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al asignar vidrio");
      }

      onSave?.();
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Asignar Vidrio a Obra">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Select
          label="Seleccionar Obra"
          value={obraId}
          onChange={(e) => setObraId(e.target.value)}
          options={obras.map((obra) => ({
            label: obra.nombre,
            value: obra._id,
          }))}
          required
        />

        <Input
          label="Ancho (mm)"
          type="number"
          value={ancho}
          onChange={(e) => setAncho(e.target.value)}
          required
        />

        <Input
          label="Alto (mm)"
          type="number"
          value={alto}
          onChange={(e) => setAlto(e.target.value)}
          required
        />

        <ErrorText>{errorMsg}</ErrorText>

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <Button type="submit" disabled={loading}>Asignar</Button>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
