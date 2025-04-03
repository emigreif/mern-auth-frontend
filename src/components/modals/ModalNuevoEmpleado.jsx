import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

export default function ModalNuevoEmpleado({ empleado = null, onCreated, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    direccion: "",
    puesto: "",
    salario: 0,
    salarioRegistrado: 0,
    salarioNoRegistrado: 0,
    activo: true
  });

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (empleado) {
      setForm({
        ...empleado,
        salario: empleado.salario ?? (empleado.salarioRegistrado + empleado.salarioNoRegistrado),
        salarioRegistrado: empleado.salarioRegistrado ?? 0,
        salarioNoRegistrado: empleado.salarioNoRegistrado ?? 0
      });
    }
  }, [empleado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value,
      };

      // Ajustar el otro campo automáticamente según el total
      if (name === "salarioRegistrado") {
        updated.salarioNoRegistrado = Math.max(updated.salario - updated.salarioRegistrado, 0);
      }
      if (name === "salarioNoRegistrado") {
        updated.salarioRegistrado = Math.max(updated.salario - updated.salarioNoRegistrado, 0);
      }
      if (name === "salario") {
        const actualBlanco = prev.salarioRegistrado;
        const actualNegro = prev.salarioNoRegistrado;
        const totalActual = actualBlanco + actualNegro;
        if (totalActual === 0) {
          updated.salarioRegistrado = 0;
          updated.salarioNoRegistrado = 0;
        } else {
          const ratioBlanco = actualBlanco / totalActual;
          updated.salarioRegistrado = +(value * ratioBlanco).toFixed(2);
          updated.salarioNoRegistrado = +(value * (1 - ratioBlanco)).toFixed(2);
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.nombre.trim() || !form.apellido.trim() || !form.dni.trim()) {
      setErrorMsg("Los campos nombre, apellido y DNI son requeridos.");
      return;
    }

    const method = empleado ? "PUT" : "POST";
    const url = empleado
      ? `${API_URL}/api/employee/${empleado._id}`
      : `${API_URL}/api/employee`;

    const body = {
      ...form,
      salario: form.salarioRegistrado + form.salarioNoRegistrado,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar el empleado");
      }
      await res.json();
      onCreated?.();
      onClose?.();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <ModalBase isOpen={true} onClose={onClose} title={empleado ? "Editar Empleado" : "Nuevo Empleado"}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        {[
          { label: "Nombre", name: "nombre" },
          { label: "Apellido", name: "apellido" },
          { label: "DNI", name: "dni" },
          { label: "Email", name: "email", type: "email" },
          { label: "Teléfono", name: "telefono" },
          { label: "Dirección", name: "direccion" },
          { label: "Puesto", name: "puesto" },
        ].map((field) => (
          <div className={styles.formGroup} key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required={["nombre", "apellido", "dni"].includes(field.name)}
            />
          </div>
        ))}

        <div className={styles.formGroup}>
          <label>Salario Total</label>
          <input type="number" name="salario" value={form.salario} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Parte Registrada (Blanco)</label>
          <input type="number" name="salarioRegistrado" value={form.salarioRegistrado} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Parte No Registrada (Negro)</label>
          <input type="number" name="salarioNoRegistrado" value={form.salarioNoRegistrado} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Activo</label>
          <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
        </div>

        <div className={styles.actions}>
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </ModalBase>
  );
}
