// src/pages/Register.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

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
    cantidadUsuarios: "",
    direccion: "",
    localidad: "",
    codigoPostal: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas
    if (formData.password !== formData.repeatPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    try {
      // Llama al register del AuthContext
      await register(formData);
      // Redirige a una ruta protegida (por ejemplo, /obras)
      navigate("/obras");
    } catch (error) {
      setErrorMsg("Error al registrar usuario");
    }
  };

  return (
    <div className="auth-container">
      {/* Sección de bienvenida pasa al lado IZQUIERDO */}
      <div className="auth-right">
        <h1>Bienvenido a PLANNER</h1>
        <p>La herramienta pensada para tu empresa.</p>
      </div>

      {/* Formulario pasa al lado DERECHO */}
      <div className="auth-left">
        <form onSubmit={handleSubmit}>
          <h2>Registrarse</h2>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="razonSocial"
            placeholder="Razón Social"
            onChange={handleChange}
          />
          <input
            type="text"
            name="cuit"
            placeholder="CUIT"
            onChange={handleChange}
          />
          <input
            type="text"
            name="plan"
            placeholder="Plan (Básico, Premium, etc.)"
            onChange={handleChange}
          />
          <input
            type="number"
            name="cantidadUsuarios"
            placeholder="Cantidad de Usuarios"
            onChange={handleChange}
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            onChange={handleChange}
          />
          <input
            type="text"
            name="localidad"
            placeholder="Localidad"
            onChange={handleChange}
          />
          <input
            type="text"
            name="codigoPostal"
            placeholder="Código Postal"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repetir Contraseña"
            onChange={handleChange}
            required
          />

          <button className="signup-btn" type="submit">Crear cuenta</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
