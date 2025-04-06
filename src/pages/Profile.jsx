import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { Link } from "react-router-dom";

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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar perfil");
      }
      setSuccessMsg(data.message || "Perfil actualizado correctamente");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Debes iniciar sesión para ver tu perfil.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Mi Perfil</h1>
        <div style={{ display: "flex", flexWrap: "wrap", color: "gray", gap: "50px" }}>
          <h3>
            <Link to="/configuracion">Configuración</Link>
          </h3>
          <h3>
            <Link to="/perfiles">Perfiles</Link>
          </h3>
        </div>
      </div>

      {errorMsg && <p >{errorMsg}</p>}
      {successMsg && <p >{successMsg}</p>}

      <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input
          label="Nombre"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          disabled={loading}
        />
        <Input
          label="Apellido"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          disabled={loading}
        />
        <Input
          label="Email (no editable)"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled
        />
        <Input
          label="Contraseña Actual"
          name="password"
          type="password"
          placeholder="Sólo si cambias la contraseña"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />
        <Input
          label="Nueva Contraseña"
          name="newPassword"
          type="password"
          placeholder="Sólo si cambias la contraseña"
          value={formData.newPassword}
          onChange={handleChange}
          disabled={loading}
        />
        <div >
          <Button type="submit" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
