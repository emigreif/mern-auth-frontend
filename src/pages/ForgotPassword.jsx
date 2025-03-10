// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import "../styles/Auth.css";

const ForgotPassword = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al solicitar restablecimiento");
      setMessage("Revisa tu correo para continuar con el restablecimiento de contraseña.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <form onSubmit={handleForgotPassword}>
          <h2>¿Olvidaste tu contraseña?</h2>
          {message && <p style={{ color: "green" }}>{message}</p>}
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="signup-btn" type="submit">Enviar</button>
        </form>
      </div>
      <div className="auth-right">
        <h1>Recuperar contraseña</h1>
        <p>Te enviaremos un correo con los pasos a seguir para restablecer tu contraseña.</p>
      </div>
    </div>
  );
};

export default ForgotPassword;
