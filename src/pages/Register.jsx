// src/pages/Register.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/Register.module.css";
import Button from "../components/ui/Button";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    firstName: "",
    lastName: "",
    razonSocial: "",
    cuit: "",
    plan: "",
    cantidadUsuarios: 1,
    direccion: "",
    localidad: "",
    codigoPostal: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.repeatPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      alert("Usuario registrado correctamente");
      navigate("/login");
    } catch (error) {
      alert(error.message);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      {/* Sección Izquierda (form) */}
      <div className={styles.leftSide}>
        <div className={styles.formBox}>
          <h2>Registrarse</h2>
          {errorMsg && <p className={`${styles.message} ${styles.error}`}>{errorMsg}</p>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Nombre</label>
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Apellido</label>
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Razón Social</label>
              <input
                type="text"
                name="razonSocial"
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>CUIT</label>
              <input
                type="text"
                name="cuit"
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Plan</label>
              <input
                type="text"
                name="plan"
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Cantidad de Usuarios</label>
              <input
                type="number"
                name="cantidadUsuarios"
                min="1"
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Localidad</label>
              <input
                type="text"
                name="localidad"
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Código Postal</label>
              <input
                type="text"
                name="codigoPostal"
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Repetir Contraseña</label>
              <input
                type="password"
                name="repeatPassword"
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
          </form>
        </div>
      </div>

      {/* Sección Derecha (info) */}
      <div className={styles.rightSide}>
        <h1>Bienvenido a PLANNER</h1>
        <p>La herramienta pensada para tu empresa.</p>
      </div>
    </div>
  );
};

export default Register;
