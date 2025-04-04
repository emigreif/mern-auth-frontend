// src/components/modals/ModalNuevoCliente.jsx
import React, { useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

const ModalNuevoCliente = ({ onClose, onSaved, token, apiUrl }) => {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!form.nombre || !form.direccion) {
      setError("Nombre y dirección son obligatorios");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar cliente");
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ModalBase title="Nuevo Cliente" isOpen={true} onClose={onClose}>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
        <Input label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} required />
        <Input label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <ErrorText>{error}</ErrorText>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button onClick={handleGuardar}>Guardar</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default ModalNuevoCliente;
