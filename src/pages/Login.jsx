import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Primer login
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Segundo login (perfil)
  const [perfilName, setPerfilName] = useState("");
  const [perfilPass, setPerfilPass] = useState("");

  const [phase, setPhase] = useState("login"); // "login" | "perfil"
  const [errorMsg, setErrorMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleGeneralLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, pass); // AuthContext => user
      setPhase("perfil");
      setErrorMsg("");
    } catch (error) {
      setErrorMsg("Usuario/Contraseña incorrectos.");
    }
  };

  const handlePerfilLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/perfiles/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfilName, perfilPass }),
      });
      if (!res.ok) throw new Error("Perfil/Contraseña de perfil inválidos");
      navigate("/obras"); // o la ruta principal
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
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <button type="submit">Ingresar</button>
          </form>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            <h3>Bienvenido a PLANNER</h3>
            <p>La herramienta para potenciar tu empresa.</p>
          </div>
        )}
      </div>

      {/* Lado derecho (verde) */}
      <div className="auth-right">
        {phase === "login" ? (
          <>
            <h1>¡Hola!</h1>
            <p>Ingresa tus credenciales de usuario.</p>
          </>
        ) : (
          <form onSubmit={handlePerfilLogin}>
            <h2>Seleccionar Perfil</h2>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <input
              type="text"
              placeholder="Nombre de Perfil"
              value={perfilName}
              onChange={(e) => setPerfilName(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña de Perfil"
              value={perfilPass}
              onChange={(e) => setPerfilPass(e.target.value)}
              required
            />
            <button type="submit">Acceder al Perfil</button>
          </form>
        )}
      </div>
    </div>
  );
}
