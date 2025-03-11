// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // Datos del usuario
  const [token, setToken] = useState(null);  // Guardamos el JWT
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Al montar, cargamos el token de localStorage (si existe)
  // Pero NO cargamos user automáticamente.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // O podrías hacer fetchUser(storedToken) SOLO si ya hiciste el 2do paso,
      // pero aquí asumimos que no quieres saltar a ProtectedRoutes sin el segundo paso.
    }
    setLoading(false);
  }, []);

  // 1. Primer login (usuario)
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json(); 
      // data: { token, user } => NO asignamos user todavía

      if (!data.token) throw new Error("No se recibió token del servidor");

      setToken(data.token);
      localStorage.setItem("token", data.token);

      // NO hacemos setUser(data.user)
      // Quedamos con user = null => 2do paso faltante
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  // 2. Segundo login (perfil)
  // Aquí SÍ asignamos user si la validación de perfil es exitosa
  const loginPerfil = async (perfilName, perfilPass) => {
    if (!token) throw new Error("No hay token, inicia sesión de usuario primero");
    try {
      const res = await fetch(`${API_URL}/api/perfiles/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ perfilName, perfilPass }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error en login de perfil");
      }

      // Podrías devolver un perfil, o un user "completo".
      // Si tu backend no retorna el user completo, haz un fetchUser() tras esto.
      const data = await res.json();
      console.log("Perfil validado:", data);

      // 2.1) Opción A: si tu backend retorna user completo, setUser(user).
      // 2.2) Opción B: tras loguear el perfil, hacemos fetchUser() para obtener user:
      await fetchUser(token);
    } catch (error) {
      console.error("Error en loginPerfil:", error);
      throw error;
    }
  };

  // 3. Cargar user tras el 2do paso
  const fetchUser = async (jwtToken) => {
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`
        },
      });
      if (!response.ok) throw new Error("No autenticado");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error obteniendo perfil de usuario:", error);
      setUser(null);
    }
  };

  // 4. logout
  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  // 5. register (igual)
  const register = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al registrar usuario");

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
    login,
    loginPerfil,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
