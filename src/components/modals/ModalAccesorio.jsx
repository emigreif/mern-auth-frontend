// src/components/modals/ModalAccesorio.jsx
import React, { useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

const UNIDADES = ["unidades", "cajas", "metros", "rollos"];
const TIPOS = [
  "accesorios",
  "herrajes",
  "tornillos",
  "bulones",
  "felpas",
  "selladores / espuma",
  "otro",
];

export default function ModalAccesorio({ accesorio, onClose, onSaved, apiUrl, token }) {
  const [form, setForm] = useState({
    codigo: accesorio?.codigo || "",
    descripcion: accesorio?.descripcion || "",
    color: accesorio?.color || "",
    cantidad: accesorio?.cantidad || 0,
    unidad: accesorio?.unidad || "unidades",
    tipo: accesorio?.tipo || "accesorios",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!form.codigo || !form.descripcion) {
      setErrorMsg("Código y descripción son obligatorios");
      return;
    }

    const method = accesorio ? "PUT" : "POST";
    const url = accesorio
      ? `${apiUrl}/api/general/accesorios/${accesorio._id}`
      : `${apiUrl}/api/general/accesorios`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar accesorio");
      onSaved?.();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <ModalBase
      title={accesorio ? "Editar Accesorio" : "Nuevo Accesorio"}
      isOpen={true}
      onClose={onClose}
    >
      <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Input name="codigo" label="Código" value={form.codigo} onChange={handleChange} required />
        <Input name="descripcion" label="Descripción" value={form.descripcion} onChange={handleChange} required />
        <Input name="color" label="Color" value={form.color} onChange={handleChange} />
        <Input name="cantidad" label="Cantidad" type="number" value={form.cantidad} onChange={handleChange} />
        <Select name="unidad" label="Unidad" value={form.unidad} onChange={handleChange} options={UNIDADES} />
        <Select name="tipo" label="Tipo" value={form.tipo} onChange={handleChange} options={TIPOS} />

        <ErrorText>{errorMsg}</ErrorText>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button onClick={handleGuardar}>{accesorio ? "Actualizar" : "Guardar"}</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
