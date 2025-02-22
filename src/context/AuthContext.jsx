import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate(); // Importamos useNavigate
  
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
  
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);  // Guarda token
      setUser(data.user);
      navigate('/dashboard'); // Redirige automáticamente al Dashboard
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json(); // Obtener datos
        setUser(data.user); // Establecer usuario en el estado
      } else {
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
