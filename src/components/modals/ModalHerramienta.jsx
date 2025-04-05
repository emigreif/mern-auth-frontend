import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ModalHerramienta({ herramienta, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    descripcion: "",
    numeroSerie: "",
    estado: "en taller",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const defaults = {
      marca: "",
      modelo: "",
      descripcion: "",
      numeroSerie: "",
      estado: "en taller",
    };
    setFormData({ ...defaults, ...herramienta });
  }, [herramienta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.marca || !formData.modelo || !formData.descripcion || !formData.numeroSerie) {
      setErrorMsg("Todos los campos son obligatorios");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const url = herramienta
        ? `${API_URL}/api/panol/herramientas/${herramienta._id}`
        : `${API_URL}/api/panol/herramientas`;

      const method = herramienta ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al guardar la herramienta");
      }

      onSaved?.();
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      isOpen={true}
      onClose={onClose}
      title={herramienta ? "Editar Herramienta" : "Agregar Herramienta"}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input
          label="Marca"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          required
        />
        <Input
          label="Modelo"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
          required
        />
        <Input
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
        <Input
          label="Número de Serie"
          name="numeroSerie"
          value={formData.numeroSerie}
          onChange={handleChange}
          required
        />
        <Select
          label="Estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          options={[
            { value: "en taller", label: "En taller" },
            { value: "en obra", label: "En obra" },
            { value: "en reparación", label: "En reparación" },
          ]}
        />

        <ErrorText>{errorMsg}</ErrorText>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Button type="submit" disabled={loading}>
            {herramienta ? "Actualizar" : "Guardar"}
          </Button>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
