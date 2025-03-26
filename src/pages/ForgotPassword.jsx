// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import styles from "../styles/pages/ForgotPassword.module.css";

/**
 * Página "ForgotPassword"
 * - Lógica para enviar correo de recuperación a /api/auth/forgot-password
 */
const ForgotPassword = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al solicitar restablecimiento");
      }
      setMessage("Revisa tu correo para continuar con el restablecimiento de contraseña.");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotContainer}>
      {/* Lado izquierdo (form) */}
      <div className={styles.leftSide}>
        <div className={styles.formBox}>
          <h2>¿Olvidaste tu contraseña?</h2>
          {errorMsg && <p className={`${styles.message} ${styles.error}`}>{errorMsg}</p>}
          {message && <p className={styles.message}>{message}</p>}

          <form onSubmit={handleForgotPassword}>
            <div className={styles.formGroup}>
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>

      {/* Lado derecho (info) */}
      <div className={styles.rightSide}>
        <h1>Recuperar contraseña</h1>
        <p>
          Te enviaremos un correo con los pasos a seguir para restablecer tu contraseña. 
          Por favor, verifica tu bandeja de entrada y/o carpeta de spam.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
