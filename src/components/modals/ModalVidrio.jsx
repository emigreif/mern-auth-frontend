import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";

export default function ModalVidrio({
  isOpen,
  onClose,
  vidrioData = null,
  onSave,
}) {
  const [form, setForm] = useState({
    descripcion: "",
    tipo: "simple",
    ancho: 0,
    alto: 0,
    cantidad: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      descripcion: vidrioData?.descripcion || "",
      tipo: vidrioData?.tipo || "simple",
      ancho: vidrioData?.ancho || 0,
      alto: vidrioData?.alto || 0,
      cantidad: vidrioData?.cantidad || 0,
    });
  }, [vidrioData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "descripcion" || name === "tipo" ? value : parseFloat(value),
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={vidrioData ? "Editar Vidrio" : "Nuevo Vidrio"}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label>Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />
          {errors.descripcion && (
            <small style={{ color: "red" }}>{errors.descripcion}</small>
          )}
        </div>

        <div>
          <label>Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="simple">Simple</option>
            <option value="dvh">Doble (DVH)</option>
            <option value="tvh">Triple (TVH)</option>
          </select>
        </div>

        <div>
          <label>Ancho (mm)</label>
          <input
            type="number"
            name="ancho"
            value={form.ancho}
            onChange={handleChange}
          />
          {errors.ancho && (
            <small style={{ color: "red" }}>{errors.ancho}</small>
          )}
        </div>

        <div>
          <label>Alto (mm)</label>
          <input
            type="number"
            name="alto"
            value={form.alto}
            onChange={handleChange}
          />
          {errors.alto && <small style={{ color: "red" }}>{errors.alto}</small>}
        </div>

        <div>
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={form.cantidad}
            onChange={handleChange}
          />
          {errors.cantidad && (
            <small style={{ color: "red" }}>{errors.cantidad}</small>
          )}
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
        >
          <Button type="submit">Guardar</Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
