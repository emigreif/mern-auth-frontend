// src/components/modals/ModalNuevoCliente.jsx
import React, { useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import styles from "../../styles/components/Form.module.css";

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
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
        <Input label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} />
        <Input label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        {error && <p className={styles.error}>{error}</p>}
        <div style={{ marginTop: 16, display: "flex", gap: "1rem" }}>
          <Button onClick={handleGuardar}>Guardar</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default ModalNuevoCliente;
