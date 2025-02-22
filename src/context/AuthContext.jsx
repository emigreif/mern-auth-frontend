import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/user/profile', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  const login = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    }
  };

  const logout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };
  const register = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/r egister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Usuario creado con éxito
        // Puedes parsear la respuesta si deseas datos extras
        // const data = await response.json();
        // setUser(data.user); // si el backend retorna un user
      } else {
        // Manejar error (400, 500, etc.)
        console.log('Error al registrar usuario');
      }
    } catch (error) {
      console.log('Error en la petición:', error);
    }
  };
  return (
    <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
