// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Profile.module.css";

/**
 * Página "Profile"
 * - Muestra datos del usuario
 * - Permite actualizar nombre, apellido
 * - Permite cambiar contraseña (requiere contraseña actual y nueva)
 */
const Profile = () => {
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",      // contraseña actual
    newPassword: ""    // contraseña nueva
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Al montar, si hay user, llenamos form
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        newPassword: ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar perfil");
      }

      // Asume que el backend retorna { message, user } o { user } con datos actualizados
      setSuccessMsg(data.message || "Perfil actualizado correctamente");
      // Podrías refrescar `user` en AuthContext si tu backend lo retorna
      // E.g. setUser(data.user) => si tu AuthContext lo permite
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.spinner}>
        Debes iniciar sesión para ver tu perfil.
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Mi Perfil</h1>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {successMsg && <p className={styles.success}>{successMsg}</p>}

      <form onSubmit={handleUpdateProfile}>
        {/* Nombre */}
        <div className={styles.formGroup}>
          <label>Nombre</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Apellido */}
        <div className={styles.formGroup}>
          <label>Apellido</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Email (solo lectura si no deseas permitir cambiarlo) */}
        <div className={styles.formGroup}>
          <label>Email (no editable)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
          />
        </div>

        {/* Contraseña actual */}
        <div className={styles.formGroup}>
          <label>Contraseña Actual</label>
          <input
            type="password"
            name="password"
            placeholder="Sólo si cambias la contraseña"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Nueva Contraseña */}
        <div className={styles.formGroup}>
          <label>Nueva Contraseña</label>
          <input
            type="password"
            name="newPassword"
            placeholder="Sólo si cambias la contraseña"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <button className={styles.saveBtn} type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
