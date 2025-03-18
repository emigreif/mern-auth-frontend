// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Contexto de Autenticación
 * - Maneja 'user', 'token' y acciones: login, logout, register, etc.
 */

const AuthContext = createContext();

/**
 * Hook de conveniencia para usar el contexto
 */
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // Datos del usuario (tras 2do login)
  const [token, setToken] = useState(null);  // Guardamos el JWT tras 1er login
  const [loading, setLoading] = useState(true);

  // Ajusta la URL de tu backend:
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /**
   * Al montar el AuthProvider, cargamos el token de localStorage (si existe).
   * No hacemos fetchUser() automático hasta el 2do login, a menos que quieras
   * forzar a revalidar el user si ya existe un token.
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // O, si quieres forzar a traer el user:
      // fetchUser(storedToken);
    }
    setLoading(false);
  }, []);

  /**
   * 1. Primer login (usuario)
   *    - Solo guarda el token, NO setea user.
   */
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Credenciales inválidas");
      }
      const data = await res.json();
      if (!data.token) {
        throw new Error("No se recibió token del servidor");
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);
      // NO hacemos setUser(data.user), a menos que tu backend ya retorne un user completo
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  /**
   * 2. Segundo login (perfil)
   *    - Aquí sí asignamos user si la validación de perfil es exitosa.
   */
  const loginPerfil = async (perfilName, perfilPass) => {
    if (!token) {
      throw new Error("No hay token, inicia sesión de usuario primero");
    }
    try {
      const res = await fetch(`${API_URL}/api/perfiles/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ perfilName, perfilPass })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error en login de perfil");
      }

      // Podrías devolver un perfil, o un user "completo".
      // Si tu backend no retorna el user completo, haz un fetchUser(token) tras esto.
      const data = await res.json();
      console.log("Perfil validado:", data);

      // Opción A: si tu backend retorna user completo:
      // setUser(data.user);

      // Opción B: si no, hacemos un fetchUser():
      await fetchUser(token);
    } catch (error) {
      console.error("Error en loginPerfil:", error);
      throw error;
    }
  };

  /**
   * 3. Cargar user tras tener token (ej. tras loginPerfil).
   */
  const fetchUser = async (jwtToken) => {
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`
        }
      });
      if (!response.ok) throw new Error("No autenticado");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error obteniendo perfil de usuario:", error);
      setUser(null);
    }
  };

  /**
   * 4. Logout
   *    - Se hace un fetch /api/auth/logout (opcional)
   *    - Borramos token y user
   */
  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  /**
   * 5. Register (crea usuario en la DB)
   */
  const register = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al registrar usuario");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    // funciones
    login,
    loginPerfil,
    logout,
    register,
    // si quieres exponer fetchUser (por ejemplo, para refrescar):
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
