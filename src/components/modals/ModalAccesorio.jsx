// src/components/modals/ModalAccesorio.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import styles from "../../styles/components/Form.module.css";

const UNIDADES = ["unidades", "cajas", "metros", "rollos"];
const TIPOS = ["accesorios",
      "herrajes",
      "tornillos",
      "bulones",
      "felpas",
      "selladores / espuma",
      "otro"];

const ModalAccesorio = ({
  accesorio = null,
  onClose,
  onSaved,
  apiUrl,
  token,
}) => {
  const [form, setForm] = useState({
    codigo: accesorio?.codigo || "",
    descripcion: accesorio?.descripcion || "",
    color: accesorio?.color || "",
    cantidad: accesorio?.cantidad || 0,
    unidad: accesorio?.unidad || "u",
    tipo: accesorio?.tipo || "común",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!form.codigo || !form.descripcion) {
      setError("Código y descripción son obligatorios");
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
      setError(err.message);
    }
  };

  return (
    <ModalBase
      title={accesorio ? "Editar Accesorio" : "Nuevo Accesorio"}
      isOpen={true}
      onClose={onClose}
    >
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Código"
          name="codigo"
          value={form.codigo}
          onChange={handleChange}
          required
        />
        <Input
          label="Descripción"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
        />
        <Input
          label="Color"
          name="color"
          value={form.color}
          onChange={handleChange}
        />
        <Input
          label="Cantidad"
          name="cantidad"
          type="number"
          value={form.cantidad}
          onChange={handleChange}
        />
        <Select
          label="Unidad"
          name="unidad"
          value={form.unidad}
          onChange={handleChange}
          options={UNIDADES}
        />
        <Select
          label="Tipo"
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          options={TIPOS}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div style={{ marginTop: 16, display: "flex", gap: "0.5rem" }}>
          <Button onClick={handleGuardar}>
            {accesorio ? "Actualizar" : "Guardar"}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default ModalAccesorio;
