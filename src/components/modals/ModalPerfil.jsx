import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ModalPerfil({ isOpen, onClose, perfilData = null, onSave }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    largo: 0,
    pesoxmetro: 0,
    cantidad: 0,
  });

  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Función auxiliar para prevenir NaN y valores undefined
  const safeNumber = (val) => (isNaN(parseFloat(val)) ? 0 : parseFloat(val));

  // Aplicar defaults seguros al abrir modal
  useEffect(() => {
    const defaults = {
      codigo: "",
      descripcion: "",
      color: "",
      largo: 0,
      pesoxmetro: 0,
      cantidad: 0,
    };
    setForm({ ...defaults, ...perfilData });
  }, [perfilData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: ["largo", "pesoxmetro", "cantidad"].includes(name) ? safeNumber(value) : value,
    }));
  };

  const validate = () => {
    const err = {};
    if (!form.codigo) err.codigo = "Código requerido";
    if (!form.descripcion) err.descripcion = "Descripción requerida";
    if (form.largo <= 0) err.largo = "Largo inválido";
    if (form.pesoxmetro <= 0) err.pesoxmetro = "Peso x metro inválido";
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
      const url = perfilData
        ? `${API_URL}/api/panol/perfiles/${perfilData._id}`
        : `${API_URL}/api/panol/perfiles`;
      const method = perfilData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al guardar perfil");
      }

      onSave?.();
      onClose();
    } catch (err) {
      console.error("❌ Error al guardar perfil:", err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={perfilData ? "Editar Perfil" : "Nuevo Perfil"}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input label="Código" name="codigo" value={form.codigo} onChange={handleChange} />
        <Input label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} />
        <Input label="Color" name="color" value={form.color} onChange={handleChange} />
        <Input label="Largo (mm)" type="number" name="largo" value={form.largo} onChange={handleChange} />
        <Input label="Peso x metro (kg)" type="number" name="pesoxmetro" value={form.pesoxmetro} onChange={handleChange} />
        <Input label="Cantidad" type="number" name="cantidad" value={form.cantidad} onChange={handleChange} />

        {Object.values(errors).map((e, idx) => (
          <ErrorText key={idx}>{e}</ErrorText>
        ))}
        <ErrorText>{errorMsg}</ErrorText>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Button type="submit" disabled={loading}>
            {perfilData ? "Actualizar" : "Guardar"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
