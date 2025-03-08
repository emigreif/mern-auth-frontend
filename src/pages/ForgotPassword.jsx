// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Ajusta la URL según tu entorno
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al solicitar restablecimiento");
      }

      setMessage("Por favor revisa tu correo para continuar con el restablecimiento de contraseña.");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <form  onSubmit={handleForgotPassword}>
          <h2>¿Olvidaste tu contraseña?</h2>
          <p>Ingresa tu email para recibir instrucciones de restablecimiento.</p>
          {message && <p style={{ color: "green" }}>{message}</p>}

          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Enviar</button>
        </form>
      </div>

      <div className="auth-right">
        <h1 className="h1blanco">Recuperar contraseña</h1>
        <p>
          Te enviaremos un correo con los pasos a seguir para restablecer tu contraseña.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
