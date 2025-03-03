// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    newPassword: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Cargar datos iniciales del perfil
  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error actualizando perfil');
      }

      const updated = await res.json();
      alert(updated.message);
      // Actualizar datos en la interfaz o en el contexto si fuera necesario
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Mi Perfil</h1>
      <label>Nombre</label>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <label>Apellido</label>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <label>Contraseña Actual</label>
      <input
        type="password"
        name="password"
        placeholder="Solo si vas a cambiar la contraseña"
        value={formData.password}
        onChange={handleChange}
      />
      <label>Nueva Contraseña</label>
      <input
        type="password"
        name="newPassword"
        placeholder="Solo si vas a cambiar la contraseña"
        value={formData.newPassword}
        onChange={handleChange}
      />
      <button onClick={handleUpdateProfile}>Actualizar Perfil</button>
    </div>
  );
};

export default Profile;
