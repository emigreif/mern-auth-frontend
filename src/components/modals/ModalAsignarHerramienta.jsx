import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          herramienta,
          obra,
          responsable,
          cantidad
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al asignar herramienta");
      }

      onSave();
      onClose();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Asignar Herramienta">
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <label>Herramienta (nombre o ID)</label>
        <input
          value={herramienta}
          onChange={(e) => setHerramienta(e.target.value)}
          required
        />

        <label>Obra</label>
        <select value={obra} onChange={(e) => setObra(e.target.value)} required>
          <option value="">Seleccionar obra</option>
          {obras.map((o) => (
            <option key={o._id} value={o._id}>
              {o.nombre}
            </option>
          ))}
        </select>

        <label>Responsable</label>
        <select value={responsable} onChange={(e) => setResponsable(e.target.value)} required>
          <option value="">Seleccionar empleado</option>
          {empleados.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.nombre} {emp.apellido}
            </option>
          ))}
        </select>

        <label>Cantidad</label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value))}
          min={1}
          required
        />

        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>
            Asignar
          </Button>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
