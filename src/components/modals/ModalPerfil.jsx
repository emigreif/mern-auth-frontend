// src/components/modals/modalPerfil.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

export default function ModalPerfil({ isOpen, onClose, perfilData = {}, onSave }) {
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    color: "",
    largo: 0,
    pesoxmetro: 0,
    cantidad: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (perfilData) {
      setFormData(perfilData);
    }
  }, [perfilData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!formData.codigo) err.codigo = "Código requerido";
    if (!formData.descripcion) err.descripcion = "Descripción requerida";
    if (formData.cantidad < 0) err.cantidad = "Cantidad no puede ser negativa";
    if (formData.largo < 0) err.largo = "Largo no puede ser negativo";
    if (formData.pesoxmetro < 0) err.pesoxmetro = "Peso x metro inválido";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Perfil OV">
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label>Código</label>
          <input type="text" name="codigo" value={formData.codigo || ""} onChange={handleChange} />
          <ErrorText>{errors.codigo}</ErrorText>
        </div>

        <div>
          <label>Descripción</label>
          <input type="text" name="descripcion" value={formData.descripcion || ""} onChange={handleChange} />
          <ErrorText>{errors.descripcion}</ErrorText>
        </div>

        <div>
          <label>Color</label>
          <input type="text" name="color" value={formData.color || ""} onChange={handleChange} />
        </div>

        <div>
          <label>Largo</label>
          <input type="number" name="largo" value={formData.largo || 0} onChange={handleChange} />
          <ErrorText>{errors.largo}</ErrorText>
        </div>

        <div>
          <label>Peso x metro</label>
          <input type="number" name="pesoxmetro" value={formData.pesoxmetro || 0} onChange={handleChange} />
          <ErrorText>{errors.pesoxmetro}</ErrorText>
        </div>

        <div>
          <label>Cantidad</label>
          <input type="number" name="cantidad" value={formData.cantidad || 0} onChange={handleChange} />
          <ErrorText>{errors.cantidad}</ErrorText>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button type="submit">Guardar</Button>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
