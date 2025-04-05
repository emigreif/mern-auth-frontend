// src/components/modals/ModalAsignarPerfil.jsx
import React, { useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import Select from "../ui/Select.jsx";
import Input from "../ui/Input.jsx";
import ErrorText from "../ui/ErrorText.jsx";

export default function ModalAsignarPerfil({
  isOpen,
  onClose,
  perfiles,
  obras,
  token,
  API_URL,
  onSuccess
}) {
  const [obra, setObra] = useState("");
  const [items, setItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { codigo: "", color: "", cantidad: 1 }]);
  };

  const handleChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = field === "cantidad" ? parseFloat(value) : value;
    setItems(updated);
  };

  const handleRemove = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!obra || items.length === 0) {
      setErrorMsg("Debes seleccionar una obra y al menos un ítem.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/panol/asignar-perfiles-manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ obra, items })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al asignar perfiles");

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("❌ Error al asignar perfiles:", err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Asignar Perfiles a Obra">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Select
          label="Obra"
          value={obra}
          onChange={(e) => setObra(e.target.value)}
          options={obras.map((o) => ({ label: o.nombre, value: o._id }))}
          required
        />

        <Button onClick={handleAddItem}>+ Añadir perfil</Button>

        {items.map((item, idx) => (
          <div key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Select
              label="Código"
              value={item.codigo}
              onChange={(e) => handleChange(idx, "codigo", e.target.value)}
              options={[
                ...new Set(perfiles.map((p) => p.codigo))
              ].map((codigo) => ({ label: codigo, value: codigo }))}
              required
            />

            <Select
              label="Color"
              value={item.color}
              onChange={(e) => handleChange(idx, "color", e.target.value)}
              options={[
                ...new Set(perfiles.map((p) => p.color))
              ].map((color) => ({ label: color, value: color }))}
              required
            />

            <Input
              label="Cantidad"
              type="number"
              min="1"
              value={item.cantidad}
              onChange={(e) => handleChange(idx, "cantidad", e.target.value)}
              required
            />

            <Button variant="danger" type="button" onClick={() => handleRemove(idx)}>🗑</Button>
          </div>
        ))}

        <ErrorText>{errorMsg}</ErrorText>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Button type="submit" disabled={loading}>Asignar</Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
