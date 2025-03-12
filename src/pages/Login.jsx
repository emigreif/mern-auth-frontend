// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  const { login, loginPerfil, token } = useAuth();
  const navigate = useNavigate();

  // Campos para primer login (usuario)
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Campos para segundo login (perfil)
  const [perfilName, setPerfilName] = useState("");
  const [perfilPass, setPerfilPass] = useState("");

  // "login" o "perfil"
  const [phase, setPhase] = useState("login");
  const [errorMsg, setErrorMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 1. Primer login (usuario)
  const handleGeneralLogin = async (e) => {
    e.preventDefault();
    try {
      // Inicia sesión con email/contraseña (solo guarda el token, NO setea user)
      await login(email, pass);

      // (NUEVO) Llamar a /api/perfiles para que se cree el admin si no hay ninguno
      // Requiere que ya tengas "token" en el AuthContext
      // OJO: el token se setea en login, pero se hace setToken() de forma asíncrona
      // Para asegurar que "token" ya esté disponible, usa un pequeño truco:
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        throw new Error("No se pudo obtener token tras login.");
      }

      // Ahora hacemos la llamada
      await fetch(`${API_URL}/api/perfiles`, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      // Esto disparará la lógica en el backend que crea el perfil admin si no existe

      // Pasar a la fase "perfil"
      setPhase("perfil");
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.message || "Error en el primer login");
    }
  };

  // 2. Segundo login (perfil)
  const handlePerfilLogin = async (e) => {
    e.preventDefault();
    try {
      await loginPerfil(perfilName, perfilPass);
      // Tras validar el perfil, se setea user en AuthContext => redirigimos a /obras
      navigate("/obras");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="auth-container">
      {/* Lado izquierdo (blanco) */}
      <div className="auth-left">
        {phase === "login" ? (
          <form onSubmit={handleGeneralLogin}>
            <h2>Iniciar Sesión (Usuario)</h2>
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
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <button className="signup-btn" type="submit">Ingresar</button>
          </form>
        ) : (
          <div >
            <h3>Ingresa a tu perfil </h3>
            <p>ingresa tus credenciales para acceder a tu perfil</p>
          </div>
        )}
      </div>

      {/* Lado derecho (verde) */}
      <div className="auth-right">
        {phase === "login" ? (
          <>
            <h1>Bienvenido a Planer</h1>
            <p> la herramienta pensada para maximizar tu empresa</p>
          </>
        ) : (
          <form className="form-group" onSubmit={handlePerfilLogin}>
            
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <input
              type="text"
              placeholder="Nombre de Perfil"
              value={perfilName}
              onChange={(e) => setPerfilName(e.target.value)}
              required
              style={{
                width: '100%',
                margin: '1rem',
                borderRadius: '4px',
                border: 'none'
              }}
              
            />
            <input
              type="password"
              placeholder="Contraseña de Perfil"
              value={perfilPass}
              onChange={(e) => setPerfilPass(e.target.value)}
              required
              
              style={{
                width: '100%',
                margin: '1rem',
                borderRadius: '4px',
                border: 'none'
              }}
            />
            <button className="signup-btn" type="submit">Acceder al Perfil</button>
          </form>
        )}
      </div>
    </div>
  );
}
