import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

export default function ModalHerramienta({ herramienta, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    descripcion: "",
    numeroSerie: "",
    estado: "en taller"
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (herramienta) {
      setFormData({
        marca: herramienta.marca || "",
        modelo: herramienta.modelo || "",
        descripcion: herramienta.descripcion || "",
        numeroSerie: herramienta.numeroSerie || "",
        estado: herramienta.estado || "en taller"
      });
    }
  }, [herramienta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const url = `${API_URL}/api/panol/herramientas`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al guardar la herramienta");
      }

      onSaved(); // recarga lista
      onClose(); // cierra modal
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      isOpen={true}
      onClose={onClose}
      title={herramienta ? "Editar Herramienta" : "Agregar Herramienta"}
    >
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <label>Marca</label>
        <input
          type="text"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          required
        />

        <label>Modelo</label>
        <input
          type="text"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
          required
        />

        <label>Descripción</label>
        <input
          type="text"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />

        <label>Número de Serie</label>
        <input
          type="text"
          name="numeroSerie"
          value={formData.numeroSerie}
          onChange={handleChange}
          required
        />

        <label>Estado</label>
        <select name="estado" value={formData.estado} onChange={handleChange}>
          <option value="en taller">En taller</option>
          <option value="en obra">En obra</option>
          <option value="en reparación">En reparación</option>
        </select>

        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>
            Guardar
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
