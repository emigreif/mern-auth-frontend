// src/components/modals/ModalAsignarHerramienta.jsx
import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import ErrorText from "../ui/ErrorText.jsx";

export default function ModalAsignarHerramienta({ isOpen, onClose, onSave, token, API_URL }) {
  const [obras, setObras] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [herramienta, setHerramienta] = useState("");
  const [obra, setObra] = useState("");
  const [responsable, setResponsable] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resObras, resEmp] = await Promise.all([
          fetch(`${API_URL}/api/obras`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/employee`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const dataObras = await resObras.json();
        const dataEmp = await resEmp.json();

        setObras(dataObras || []);
        setEmpleados(dataEmp || []);
      } catch (error) {
        console.error("Error al cargar obras o empleados:", error);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!herramienta || !obra || !responsable || cantidad <= 0) {
      setErrorMsg("Todos los campos son obligatorios y la cantidad debe ser mayor a 0.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/obras/asignar-herramienta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ herramienta, obra, responsable, cantidad }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al asignar herramienta");
      }

      onSave?.();
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Asignar Herramienta a Obra">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Input
          label="Herramienta (nombre o ID)"
          value={herramienta}
          onChange={(e) => setHerramienta(e.target.value)}
          required
        />

        <Select
          label="Seleccionar Obra"
          value={obra}
          onChange={(e) => setObra(e.target.value)}
          options={obras.map((o) => ({ value: o._id, label: o.nombre }))}
          required
        />

        <Select
          label="Responsable"
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          options={empleados.map((emp) => ({
            value: emp._id,
            label: `${emp.nombre} ${emp.apellido}`,
          }))}
          required
        />

        <Input
          label="Cantidad"
          type="number"
          value={cantidad}
          min={1}
          onChange={(e) => setCantidad(parseInt(e.target.value))}
          required
        />

        <ErrorText>{errorMsg}</ErrorText>

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <Button type="submit" disabled={loading}>Asignar</Button>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
