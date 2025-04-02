import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import ModalBase from "./ModalBase.jsx";
import Button from "../ui/Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

export default function ModalIngresoMaterial({ isOpen, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [tipo, setTipo] = useState("perfil");
  const [formData, setFormData] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/panol/${tipo}s`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al ingresar material");
      }

      setLoading(false);
      onSaved();
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Ingreso Manual de Material">
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <div className={styles.formGroup}>
          <label>Tipo de material</label>
          <select name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="perfil">Perfil</option>
            <option value="vidrio">Vidrio</option>
            <option value="accesorio">Accesorio</option>
            <option value="herramienta">Herramienta</option>
          </select>
        </div>

        {/* Campos específicos */}
        {tipo === "perfil" && (
          <>
            <input name="codigo" placeholder="Código" onChange={handleChange} required />
            <input name="descripcion" placeholder="Descripción" onChange={handleChange} required />
            <input name="color" placeholder="Color" onChange={handleChange} required />
            <input name="cantidad" type="number" placeholder="Cantidad" onChange={handleChange} required />
            <input name="largo" type="number" placeholder="Largo (mm)" onChange={handleChange} required />
            <input name="pesoxmetro" type="number" placeholder="Peso x metro" onChange={handleChange} required />
          </>
        )}

        {tipo === "vidrio" && (
          <>
            <input name="descripcion" placeholder="Descripción" onChange={handleChange} required />
            <input name="cantidad" type="number" placeholder="Cantidad" onChange={handleChange} required />
            <input name="ancho" type="number" placeholder="Ancho (mm)" onChange={handleChange} required />
            <input name="alto" type="number" placeholder="Alto (mm)" onChange={handleChange} required />
            <select name="tipoVidrio" onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}>
              <option value="simple">Simple</option>
              <option value="dvh">DVH</option>
              <option value="tvh">TVH</option>
              <option value="laminado">Laminado</option>
            </select>
          </>
        )}

        {tipo === "accesorio" && (
          <>
            <input name="codigo" placeholder="Código" onChange={handleChange} required />
            <input name="descripcion" placeholder="Descripción" onChange={handleChange} required />
            <input name="color" placeholder="Color" onChange={handleChange} required />
            <input name="cantidad" type="number" placeholder="Cantidad" onChange={handleChange} required />
            <input name="unidad" placeholder="Unidad (u/ml)" onChange={handleChange} defaultValue="u" />
            <input name="tipoAccesorio" placeholder="Tipo (tornillos, felpas...)" onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))} required />
          </>
        )}

        {tipo === "herramienta" && (
          <>
            <input name="marca" placeholder="Marca" onChange={handleChange} required />
            <input name="modelo" placeholder="Modelo" onChange={handleChange} required />
            <input name="descripcion" placeholder="Descripción" onChange={handleChange} required />
            <input name="numeroSerie" placeholder="Número de Serie" onChange={handleChange} required />
            <select name="estado" onChange={handleChange} defaultValue="en taller">
              <option value="en taller">En taller</option>
              <option value="en obra">En obra</option>
              <option value="en reparación">En reparación</option>
            </select>
          </>
        )}

        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>Guardar</Button>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
