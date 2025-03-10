// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

// Creamos el contexto
const AuthContext = createContext();

// Exportamos el hook para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Exportamos el Provider que envuelve toda la app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // Datos del usuario
  const [loading, setLoading] = useState(true); // Para mostrar "Cargando..." mientras verifica login

  // Ajusta la URL de tu backend en .env
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 1. Al montar, intentamos obtener el perfil del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/profile`, {
          credentials: "include", // Envia cookies (si tu backend las usa)
        });
        if (!response.ok) throw new Error("No autenticado");

        const data = await response.json();
        setUser(data); // Asumimos que data es { _id, email, perfiles, etc. }
      } catch (error) {
        setUser(null); // Si falla, no hay usuario logueado
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [API_URL]);

  // 2. Función de login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Envia cookies
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json();
      // data puede ser { token, user } o similar
      setUser(data.user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error; // para manejarlo en el componente
    }
  };

  // 3. Función de logout
  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // 4. Función de registro
  const register = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al registrar usuario");

      const data = await res.json();
      // data.user: el usuario recién creado
      setUser(data.user);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  // Valor expuesto en el Context
  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
