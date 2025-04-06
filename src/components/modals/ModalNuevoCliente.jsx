// src/components/modals/ModalNuevoCliente.jsx
import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

const CONDICIONES = [
  { value: "consumidorFinal", label: "Consumidor Final" },
  { value: "responsableInscripto", label: "Responsable Inscripto" },
];

export default function ModalNuevoCliente({ onClose, onSaved, token, apiUrl, cliente = null }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: {
      calle: "",
      ciudad: "",
    },
    condicionFiscal: "consumidorFinal",
    razonSocial: "",
    cuit: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar datos si es edición
  useEffect(() => {
    if (cliente) {
      setForm({
        nombre: cliente.nombre || "",
        apellido: cliente.apellido || "",
        email: cliente.email || "",
        telefono: cliente.telefono || "",
        direccion: {
          calle: cliente.direccion?.calle || "",
          ciudad: cliente.direccion?.ciudad || "",
        },
        condicionFiscal: cliente.condicionFiscal || "consumidorFinal",
        razonSocial: cliente.razonSocial || "",
        cuit: cliente.cuit || "",
      });
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("direccion.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.nombre.trim() || !form.apellido.trim()) {
      return "Nombre y apellido son obligatorios.";
    }

    if (form.condicionFiscal === "responsableInscripto") {
      if (!form.razonSocial.trim()) return "Razón social requerida.";
      if (!form.cuit.trim()) return "CUIT requerido.";
    }

    return "";
  };

  const handleGuardar = async () => {
    const validationMsg = validate();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = cliente
        ? `${apiUrl}/api/clientes/${cliente._id}`
        : `${apiUrl}/api/clientes`;
      const method = cliente ? "PUT" : "POST";

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
        throw new Error(data.message || "Error al guardar cliente");
      }

      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      title={cliente ? "Editar Cliente" : "Nuevo Cliente"}
      isOpen={true}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Input name="nombre" label="Nombre" value={form.nombre} onChange={handleChange} />
        <Input name="apellido" label="Apellido" value={form.apellido} onChange={handleChange} />
        <Input name="email" label="Email" value={form.email} onChange={handleChange} type="email" />
        <Input name="telefono" label="Teléfono" value={form.telefono} onChange={handleChange} />
        <Input name="direccion.calle" label="Calle" value={form.direccion.calle} onChange={handleChange} />
        <Input name="direccion.ciudad" label="Ciudad" value={form.direccion.ciudad} onChange={handleChange} />

        <Select
          name="condicionFiscal"
          label="Condición Fiscal"
          value={form.condicionFiscal}
          onChange={handleChange}
          options={CONDICIONES}
        />

        {form.condicionFiscal === "responsableInscripto" && (
          <>
            <Input name="razonSocial" label="Razón Social" value={form.razonSocial} onChange={handleChange} />
            <Input name="cuit" label="CUIT" value={form.cuit} onChange={handleChange} />
          </>
        )}

        <ErrorText>{error}</ErrorText>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
          <Button onClick={handleGuardar} disabled={loading}>
            {cliente ? "Actualizar" : "Guardar"}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
