// src/components/modals/modalAsignarHerramienta.jsx
import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "./Button.jsx";
import styles from "../styles/modals/GlobalModal.module.css";

export default function ModalAsignarHerramienta({ isOpen, onClose, herramientaId, token, API_URL, onSuccess }) {
  const [estado, setEstado] = useState("en obra");
  const [obras, setObras] = useState([]);
  const [nomina, setNomina] = useState([]);
  const [obra, setObra] = useState("");
  const [responsable, setResponsable] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    fetchObras();
    fetchNomina();
  }, [isOpen]);

  const fetchObras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setObras(data);
    } catch (err) {
      setError("Error al cargar obras");
    }
  };

  const fetchNomina = async () => {
    try {
      const res = await fetch(`${API_URL}/api/nomina`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNomina(data);
    } catch (err) {
      setError("Error al cargar nómina");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/panol/herramientas/${herramientaId}/movimiento`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado, obra, responsable }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al asignar");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Asignar Herramienta">
      <form onSubmit={handleSubmit} className={styles.formBase}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.formGroup}>
          <label>Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="en obra">En Obra</option>
            <option value="en taller">En Taller</option>
            <option value="en reparación">En Reparación</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Obra</label>
          <select value={obra} onChange={(e) => setObra(e.target.value)} required>
            <option value="">-- Seleccionar Obra --</option>
            {obras.map((o) => (
              <option key={o._id} value={o._id}>
                {o.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Responsable</label>
          <select value={responsable} onChange={(e) => setResponsable(e.target.value)} required>
            <option value="">-- Seleccionar Responsable --</option>
            {nomina.map((n) => (
              <option key={n._id} value={n._id}>
                {n.nombre} {n.apellido}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <Button type="submit">Asignar</Button>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
