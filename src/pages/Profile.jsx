// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, setUser } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al actualizar perfil");
      const updatedUser = await res.json();
      setUser(updatedUser); // Asume que el backend retorna el usuario actualizado
      alert("Perfil actualizado");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar perfil");
    }
  };

  return (
    
      <div className="page-contenedor">
        <h1>Mi Perfil</h1>
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email (no editable)</label>
            <input type="email" name="email" value={formData.email} disabled />
          </div>
          <div className="form-group">
            <label>Contraseña Actual</label>
            <input
              type="password"
              name="password"
              placeholder="Sólo si cambias la contraseña"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Sólo si cambias la contraseña"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn">
            Actualizar
          </button>
        </form>
      </div>
   
};

export default Profile;
