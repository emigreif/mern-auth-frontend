// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";
import Button from "../components/Button.jsx";

const Profile = () => {
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    newPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Al montar, si hay user, llenamos el formulario
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        newPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar perfil");
      }
      setSuccessMsg(data.message || "Perfil actualizado correctamente");
      // Aquí podrías actualizar el contexto de usuario si lo deseas.
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

      <form onSubmit={handleUpdateProfile} className={styles.formBase}>
        <div className={styles.formGroup}>
          <label>Nombre</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled={loading} />
        </div>
        <div className={styles.formGroup}>
          <label>Apellido</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled={loading} />
        </div>
        <div className={styles.formGroup}>
          <label>Email (no editable)</label>
          <input type="email" name="email" value={formData.email} disabled />
        </div>
        <div className={styles.formGroup}>
          <label>Contraseña Actual</label>
          <input type="password" name="password" placeholder="Sólo si cambias la contraseña" value={formData.password} onChange={handleChange} disabled={loading} />
        </div>
        <div className={styles.formGroup}>
          <label>Nueva Contraseña</label>
          <input type="password" name="newPassword" placeholder="Sólo si cambias la contraseña" value={formData.newPassword} onChange={handleChange} disabled={loading} />
        </div>
        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
