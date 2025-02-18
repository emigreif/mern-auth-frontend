import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('https://your-backend-url.onrender.com/api/auth/user', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const login = async (email, password) => {
    const response = await fetch('https://your-backend-url.onrender.com/api/auth/login', {
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

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;