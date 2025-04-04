// src/components/modals/ModalIngresoMaterial.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

export default function ModalIngresoMaterial({ isOpen, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [tipo, setTipo] = useState("perfil");
  const [formData, setFormData] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/panol/${tipo}s`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al ingresar material");
      }

      onSaved();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Ingreso Manual de Material">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <ErrorText>{errorMsg}</ErrorText>

        <Select
          label="Tipo de material"
          name="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          options={["perfil", "vidrio", "accesorio", "herramienta"]}
        />

        {/* Campos específicos */}
        {tipo === "perfil" && (
          <>
            <Input name="codigo" placeholder="Código" onChange={handleChange} required />
            <Input name="descripcion" placeholder="Descripción" onChange={handleChange} required />
            <Input name="color" placeholder="Color" onChange={handleChange} required />
            <Input name="cantidad" type="number" placeholder="Cantidad" onChange={handleChange} required />
            <Input name="largo" type="number" placeholder="Largo (mm)" onChange={handleChange} required />
            <Input name="pesoxmetro" type="number" placeholder="Peso x metro" onChange={handleChange} required />
          </>
        )}

        {tipo === "vidrio" && (
          <>
            <Input name="descripcion" placeholder="Descripción" onChange={handleChange} required />
            <Input name="cantidad" type="number" placeholder="Cantidad" onChange={handleChange} required />
            <Input name="ancho" type="number" placeholder="Ancho (mm)" onChange={handleChange} required />
            <Input name="alto" type="number" placeholder="Alto (mm)" onChange={handleChange} required />
            <Select
              name="tipo"
              label="Tipo de Vidrio"
              value={formData.tipo || "simple"}
              onChange={handleChange}
              options={["simple", "dvh", "tvh", "laminado"]}
            />
          </>
        )}

        {tipo === "accesorio" && (
          <>
            <Input name="codigo" placeholder="Código" onChange={handleChange} required />
            <Input name="descripcion" placeholder="Descripción" onChange={handleChange} required />
            <Input name="color" placeholder="Color" onChange={handleChange} required />
            <Input name="cantidad" type="number" placeholder="Cantidad" onChange={handleChange} required />
            <Input name="unidad" placeholder="Unidad (u/ml)" onChange={handleChange} defaultValue="u" />
            <Input name="tipo" placeholder="Tipo (tornillos, felpas...)" onChange={handleChange} required />
          </>
        )}

        {tipo === "herramienta" && (
          <>
            <Input name="marca" placeholder="Marca" onChange={handleChange} required />
            <Input name="modelo" placeholder="Modelo" onChange={handleChange} required />
            <Input name="descripcion" placeholder="Descripción" onChange={handleChange} required />
            <Input name="numeroSerie" placeholder="Número de Serie" onChange={handleChange} required />
            <Select
              name="estado"
              label="Estado"
              value={formData.estado || "en taller"}
              onChange={handleChange}
              options={["en taller", "en obra", "en reparación"]}
            />
          </>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button type="submit" disabled={loading}>
            Guardar
          </Button>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
