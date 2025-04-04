// src/components/modals/ModalAsignarVidrio.jsx
import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

export default function ModalAsignarVidrio({ isOpen, onClose, onSave, token, API_URL }) {
  const [obras, setObras] = useState([]);
  const [vidrioId, setVidrioId] = useState("");
  const [obraId, setObraId] = useState("");
  const [cantidad, setCantidad] = useState(1);
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

    if (!vidrioId || !obraId || cantidad <= 0) {
      setErrorMsg("Todos los campos son obligatorios y la cantidad debe ser mayor a 0.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/obras/asignar-vidrio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vidrio: vidrioId, obra: obraId, cantidad }),
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
        <Input
          label="ID del Vidrio (manual)"
          value={vidrioId}
          onChange={(e) => setVidrioId(e.target.value)}
          required
        />

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
          label="Cantidad"
          type="number"
          value={cantidad}
          min={1}
          onChange={(e) => setCantidad(parseInt(e.target.value))}
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
