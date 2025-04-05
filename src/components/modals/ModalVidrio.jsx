import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ModalVidrio({ isOpen, onClose, vidrioData = null, onSave }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const safeNumber = (val) => (isNaN(parseFloat(val)) ? 0 : parseFloat(val));

  const [form, setForm] = useState({
    descripcion: "",
    tipo: "simple",
    ancho: 0,
    alto: 0,
    cantidad: 0,
  });

  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const defaults = {
      descripcion: "",
      tipo: "simple",
      ancho: 0,
      alto: 0,
      cantidad: 0,
    };
    setForm({ ...defaults, ...vidrioData });
  }, [vidrioData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["ancho", "alto", "cantidad"].includes(name) ? safeNumber(value) : value,
    }));
  };

  const validate = () => {
    const err = {};
    if (!form.descripcion.trim()) err.descripcion = "Descripción requerida";
    if (form.ancho <= 0) err.ancho = "Ancho inválido";
    if (form.alto <= 0) err.alto = "Alto inválido";
    if (form.cantidad < 0) err.cantidad = "Cantidad inválida";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const url = vidrioData
        ? `${API_URL}/api/panol/vidrios/${vidrioData._id}`
        : `${API_URL}/api/panol/vidrios`;
      const method = vidrioData ? "PUT" : "POST";

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
        throw new Error(errorData.message || "Error al guardar vidrio");
      }

      onSave?.();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={vidrioData ? "Editar Vidrio" : "Nuevo Vidrio"}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input
          label="Descripción"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />
        <Select
          label="Tipo"
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          options={[
            { value: "simple", label: "Simple" },
            { value: "dvh", label: "Doble (DVH)" },
            { value: "tvh", label: "Triple (TVH)" },
            { value: "laminado", label: "Laminado" },
          ]}
        />
        <Input
          label="Ancho (mm)"
          name="ancho"
          type="number"
          value={form.ancho}
          onChange={handleChange}
        />
        <Input
          label="Alto (mm)"
          name="alto"
          type="number"
          value={form.alto}
          onChange={handleChange}
        />
        <Input
          label="Cantidad"
          name="cantidad"
          type="number"
          value={form.cantidad}
          onChange={handleChange}
        />

        {Object.values(errors).map((e, idx) => (
          <ErrorText key={idx}>{e}</ErrorText>
        ))}
        <ErrorText>{errorMsg}</ErrorText>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Button type="submit" disabled={loading}>
            {vidrioData ? "Actualizar" : "Guardar"}
          </Button>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
