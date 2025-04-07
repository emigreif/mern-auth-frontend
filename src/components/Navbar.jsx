// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import useDarkMode from "../hooks/useDarkMode.js";
import styles from "../styles/components/Navbar.module.css";
import Button from "./ui/Button.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useDarkMode();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className={styles.topNav}>
      <div className={styles.brand}>
        <Link to="/">PLANNER</Link>
      </div>

      <div className={styles.navRight}>
        {/* 🌙 Toggle Tema */}
        <Button
          onClick={() => setIsDark(prev => !prev)}
          variant="secondary"
          size="sm"
        >
          {isDark ? "☀️ Claro" : "🌙 Oscuro"}
        </Button>

        {user ? (
          <Button onClick={handleLogout} variant="danger" size="sm">
            Cerrar Sesión
          </Button>
        ) : (
          <>
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
