import React, { useState, useEffect } from "react";
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
    codigo: "",
    descripcion: "",
    color: "",
    cantidad: 0,
    unidad: "unidades",
    tipo: "accesorios",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accesorio) {
      setForm({
        codigo: accesorio.codigo || "",
        descripcion: accesorio.descripcion || "",
        color: accesorio.color || "",
        cantidad: accesorio.cantidad || 0,
        unidad: accesorio.unidad || "unidades",
        tipo: accesorio.tipo || "accesorios",
      });
    }
  }, [accesorio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "cantidad" ? parseFloat(value) || 0 : value,
    }));
  };

  const validate = () => {
    if (!form.codigo.trim() || !form.descripcion.trim()) {
      setErrorMsg("Código y descripción son obligatorios");
      return false;
    }
    if (form.cantidad < 0) {
      setErrorMsg("La cantidad no puede ser negativa");
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    setErrorMsg("");
    if (!validate()) return;

    setLoading(true);
    const method = accesorio ? "PUT" : "POST";
    const url = accesorio
      ? `${apiUrl}/api/panol/accesorios/${accesorio._id}`
      : `${apiUrl}/api/panol/accesorios`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al guardar accesorio");
      }

      onSaved?.();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      title={accesorio ? "Editar Accesorio" : "Nuevo Accesorio"}
      isOpen={true}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGuardar();
        }}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <Input name="codigo" label="Código" value={form.codigo} onChange={handleChange} required />
        <Input name="descripcion" label="Descripción" value={form.descripcion} onChange={handleChange} required />
        <Input name="color" label="Color" value={form.color} onChange={handleChange} />
        <Input
          name="cantidad"
          label="Cantidad"
          type="number"
          value={form.cantidad}
          onChange={handleChange}
        />
        <Select
          name="unidad"
          label="Unidad"
          value={form.unidad}
          onChange={handleChange}
          options={UNIDADES}
        />
        <Select
          name="tipo"
          label="Tipo"
          value={form.tipo}
          onChange={handleChange}
          options={TIPOS}
        />

        <ErrorText>{errorMsg}</ErrorText>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button type="submit" disabled={loading}>
            {accesorio ? "Actualizar" : "Guardar"}
          </Button>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
