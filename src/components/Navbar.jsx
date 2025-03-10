
// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="top-nav">
      {/* Marca / Logo */}
      <div className="brand">
        <Link to="/">PLANNER</Link>
      </div>

      {/* Enlaces a la derecha */}
      <div className="nav-right">
        {user ? (
          <>
            
            <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
          </>
        ) : (
          <>
            {/* Si NO estás logueado */}
            <Link to="/" className="nav-comp">Home</Link>
            <Link to="/about" className="nav-comp">About</Link>
            <Link to="/planner" className="nav-comp">Planner</Link>

            <Link to="/login" className="signup-btn">Login</Link>
            <Link to="/register" className="signup-btn">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
