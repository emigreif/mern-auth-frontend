// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/obras"); // o la ruta protegida que quieras
    } catch (error) {
      setErrorMsg("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <form onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="signup-btn" type="submit">Ingresar</button>
         <div className="forgot">
          <Link  to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>
        </form>
      </div>

      <div className="auth-right">
        <h1>Bienvenido a PLANNER</h1>
        <p>La herramienta pensada para tu empresa.</p>
        <p>¿Aún no tienes cuenta? </p>
      <div className="regis">   <Link to="/register" className="nonButtonButton">Regístrate </Link></div>
      </div>
    </div>
  );
};

export default Login;
