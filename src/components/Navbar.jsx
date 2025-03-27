// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/components/Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className={styles.topNav}>
      <div className={styles.brand}>
        <Link to="/">PLANNER</Link>
      </div>

      <div className={styles.navRight}>
        {user ? (
          <>
            {/* Si está logueado */}
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </>
        ) : (
          <>
            {/* Si NO estás logueado */}
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/planner">Planner</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
