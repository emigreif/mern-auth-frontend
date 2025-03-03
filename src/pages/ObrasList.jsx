import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const ObrasList = () => {
  const [obras, setObras] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Función para cargar las obras desde el backend
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras`, {
          method: 'GET',
          credentials: 'include', // para enviar cookies si usas este método
          headers: {
            'Content-Type': 'application/json',
            // Si usas token almacenado en localStorage:
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) {
          throw new Error('Error al obtener las obras');
        }
        const data = await res.json();
        // Se asume que el backend ya filtra por el usuario logueado.
        setObras(data);
      } catch (error) {
        console.error('Error fetching obras:', error);
      }
    };

    // Solo se carga si hay un usuario logueado
    if (user) {
      fetchObras();
    }
  }, [API_URL, user]);

  return (
    <div className="obras-container">
      {/* Título de la página */}
      <h1>Obras</h1>
      
      {obras.length === 0 ? (
        <p>No hay obras registradas para este usuario.</p>
      ) : (
        obras.map((obra) => (
          <div key={obra._id} className="obra-card">
            <h2>{obra.nombre}</h2>
            <p>{obra.direccion}</p>
            {/* Agrega más campos según la información que manejes */}
          </div>
        ))
      )}
    </div>
  );
};

export default ObrasList;
