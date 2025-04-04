// src/components/modals/ModalNuevoProveedor.jsx
import React, { useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import MultiSelect from "../ui/MultiSelect.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

const RUBRO_OPTIONS = ["Vidrio", "Perfiles", "Accesorios", "Compras Generales"];

const ModalNuevoProveedor = ({
  onClose,
  onSaved,
  editMode = false,
  proveedor = null,
  proveedorId = null,
  token,
  apiUrl,
}) => {
  const [form, setForm] = useState(() => ({
    nombre: proveedor?.nombre || "",
    direccion: proveedor?.direccion || "",
    emails: proveedor?.emails?.length ? proveedor.emails : [""],
    telefono: proveedor?.telefono || "",
    whatsapp: proveedor?.whatsapp || "",
    rubro: proveedor?.rubro || [],
  }));

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (index, value) => {
    const emails = [...form.emails];
    emails[index] = value;
    setForm((prev) => ({ ...prev, emails }));
  };

  const handleAddEmail = () => {
    setForm((prev) => ({ ...prev, emails: [...prev.emails, ""] }));
  };

  const handleRemoveEmail = (index) => {
    const emails = [...form.emails];
    emails.splice(index, 1);
    setForm((prev) => ({ ...prev, emails }));
  };

  const handleGuardar = async () => {
    if (!form.nombre.trim() || !form.direccion.trim()) {
      setErrorMsg("Nombre y dirección obligatorios");
      return;
    }

    const proveedorPayload = {
      ...form,
      emails: form.emails.filter((e) => e.trim() !== ""),
    };

    const url = editMode
      ? `${apiUrl}/api/proveedores/${proveedorId}`
      : `${apiUrl}/api/proveedores`;

    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(proveedorPayload),
      });

      if (!res.ok) throw new Error("Error al guardar proveedor");
      onSaved?.();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <ModalBase
      title={editMode ? "Editar Proveedor" : "Nuevo Proveedor"}
      isOpen={true}
      onClose={onClose}
    >
      <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
        <Input label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} />
        <Input label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
        <Input label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} />

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {form.emails.map((email, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <Input
                name={`email-${i}`}
                type="email"
                placeholder={`Email ${i + 1}`}
                value={email}
                onChange={(e) => handleEmailChange(i, e.target.value)}
              />
              <Button variant="danger" type="button" onClick={() => handleRemoveEmail(i)}>X</Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddEmail}>+ Email</Button>
        </div>

        <MultiSelect
          label="Rubros"
          name="rubro"
          value={form.rubro}
          onChange={(val) => setForm({ ...form, rubro: val })}
          options={RUBRO_OPTIONS}
        />

        <ErrorText>{errorMsg}</ErrorText>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <Button onClick={handleGuardar}>{editMode ? "Actualizar" : "Guardar"}</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default ModalNuevoProveedor;
