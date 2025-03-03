// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/Profile.css'; // Importa el CSS de esta página

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    newPassword: ''
  });

  // Si tienes tu backend en una variable de entorno:
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Cargar datos iniciales del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ejemplo de función para actualizar el perfil
  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Conten Type': 'application/json',
          horization: `Bearer ${localStorage.getItem('token')}` // Si guardas el en localStorage
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error actualizando perfil');
      }

      const updated = await res.json();
      alert(updated.message);
      // Aquí podrías recargar la página o refrescar el contexto
      // para que se vea reflejado el cambio en la UI.
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Mi Perfil</h1>

        <div className="profile-form">

          <label>Nombre</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />

          <label>Apellido</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Contraseña Actual</label>
          <input type="password" name="password" placeholder="Solo si cambias la contraseña" value={formData.password} onChange={handleChange} />

          <label>Nueva Contraseña</label>
          <input type="password" name="newPassword" placeholder="Solo si cambias la contraseña" value={formData.newPassword} onChange={handleChange} />

          <button onClick={handleUpdateProfile}>Actualizar Perfil</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
