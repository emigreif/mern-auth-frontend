// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

/**
 * Página "Login"
 * - Primer login (email, password) => authContext.login
 * - Segundo login (perfilName, perfilPass) => authContext.loginPerfil
 * - Muestra errorMsg, spinner (opcional), etc.
 */
export default function Login() {
  const { login, loginPerfil, token } = useAuth();
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
      // Inicia sesión con email/contraseña
      await login(email, pass);

      // Llamada a /api/perfiles para que se cree el admin si no hay ninguno
      // O bien, en tu backend ya lo haces al loguear.
      // Se hace un fetch con el token (localStorage)
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        throw new Error("No se pudo obtener token tras login.");
      }
      // Llamar a /api/perfiles para forzar la creación del admin si no existe
      await fetch(import.meta.env.VITE_API_URL + "/api/perfiles", {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });

      // Pasar a la fase "perfil"
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
      // Tras validar el perfil => navigate a /obras (o donde desees)
      navigate("/obras");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* Lado izquierdo (form 1: usuario) */}
      <div className={styles.leftSide}>
        {phase === "login" && (
          <div className={styles.formBox}>
            <h2>Iniciar Sesión (Usuario)</h2>
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
          </div>
        )}

        {phase !== "login" && (
          <div className={styles.formBox}>
            <h2>Ya has iniciado sesión de Usuario</h2>
            <p>Ahora ingresa tu Perfil para continuar.</p>
          </div>
        )}
      </div>

      {/* Lado derecho (form 2: perfil) */}
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
              Ingresa tus credenciales de perfil para acceder a tu cuenta
              completa.
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
