// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

// Creamos el contexto
const AuthContext = createContext();

// Hook para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // Datos del usuario
  const [token, setToken] = useState(null);  // Guardamos el JWT
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Al montar, cargamos el token de localStorage (si existe) y luego obtenemos el perfil
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken); // Intentar obtener perfil con ese token
    } else {
      setLoading(false); // No hay token => no hay user
    }
  }, []);

  // Función para obtener el perfil usando el token
  const fetchUser = async (jwtToken) => {
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) throw new Error("No autenticado");

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error obteniendo perfil de usuario:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 1. Función de login (primer login, usuario/contraseña)
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json(); 
      // data: { token, user } segun tu backend
      if (!data.token) throw new Error("No se recibió token del servidor");

      setToken(data.token);
      localStorage.setItem("token", data.token);

      setUser(data.user); // Guardamos el user
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  // 2. Función de logout
  const logout = async () => {
    try {
      // Si tu backend maneja logout con cookies, hazlo:
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // opcional si tu logout lo requiere
        },
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // Borramos localStorage
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  // 3. Función de registro
  const register = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al registrar usuario");

      const data = await res.json();
      // Si tu backend retorna { token, user } tras registro:
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  // Valor expuesto en el Context
  const value = {
    user,
    setUser,
    token,           // Para usar en 2do login (perfil)
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
