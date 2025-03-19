import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

/**
 * Página "Login"
 * - Primer login (email, password) => authContext.login
 * - Segundo login (perfilName, perfilPass) => authContext.loginPerfil
 * - Muestra errorMsg, spinner (opcional), etc.
 */
export default function Login() {
  const { login, loginPerfil } = useAuth();
  const navigate = useNavigate();

  // Fases: "login" (usuario) o "perfil" (2do login)
  const [phase, setPhase] = useState("login");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Campos primer login
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Campos segundo login (perfil)
  const [perfilName, setPerfilName] = useState("");
  const [perfilPass, setPerfilPass] = useState("");

  /**
   * 1. Primer login (usuario)
   */
  const handleGeneralLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await login(email, pass);

      // Obtener token para llamar a /api/perfiles
      const currentToken = localStorage.getItem("token");
      if (!currentToken) throw new Error("No se pudo obtener token tras login.");

      await fetch(import.meta.env.VITE_API_URL + "/api/perfiles", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      setPhase("perfil");
    } catch (error) {
      setErrorMsg(error.message || "Error en el primer login");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 2. Segundo login (perfil)
   */
  const handlePerfilLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await loginPerfil(perfilName, perfilPass);
      navigate("/obras"); // Redirección tras validación
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* Lado izquierdo (Login Usuario) */}
      <div className={styles.leftSide}>
        {phase === "login" ? (
          <div className={styles.formBox}>
            <h2>Iniciar Sesión</h2>
            {errorMsg && <p className={`${styles.message} ${styles.error}`}>{errorMsg}</p>}

            <form onSubmit={handleGeneralLogin}>
              <div className={styles.formGroup}>
                <label>Correo electrónico</label>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Contraseña</label>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button className={styles.submitBtn} type="submit" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>

            {/* 🔹 Enlace para recuperar contraseña */}
            <div className={styles.loginLinks}>
              <Link to="/forgot-password" className={styles.forgotPassword}>¿Olvidaste tu contraseña?</Link>
            </div>
          </div>
        ) : (
          <div className={styles.formBox}>
            <h2>Ya has iniciado sesión</h2>
            <p>Ahora ingresa tu Perfil para continuar.</p>
          </div>
        )}
      </div>

      {/* Lado derecho (Login Perfil) */}
      <div className={styles.rightSide}>
        {phase === "login" ? (
          <>
            <h1>Bienvenido a Planner</h1>
            <p>
              La herramienta pensada para maximizar tu empresa.
              <br />
              Inicia sesión con tu correo y contraseña.
            </p>
          </>
        ) : (
          <>
            <h1>Ingresa a tu Perfil</h1>
            <p>
              Ingresa tus credenciales de perfil para acceder a tu cuenta completa.
            </p>
            {errorMsg && <p className={`${styles.message} ${styles.error}`}>{errorMsg}</p>}
            <div className={styles.profileForm}>
              <form onSubmit={handlePerfilLogin}>
                <input
                  type="text"
                  placeholder="Nombre de Perfil"
                  value={perfilName}
                  onChange={(e) => setPerfilName(e.target.value)}
                  required
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Contraseña de Perfil"
                  value={perfilPass}
                  onChange={(e) => setPerfilPass(e.target.value)}
                  required
                  disabled={loading}
                />
                <button className={styles.profileBtn} type="submit" disabled={loading}>
                  {loading ? "Accediendo..." : "Acceder al Perfil"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
