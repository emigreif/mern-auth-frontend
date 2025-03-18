// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

/**
 * Página "Home"
 * - Muestra texto de bienvenida y un botón para ingresar (link a /login)
 * - Sección derecha con un fondo degradado o una imagen
 */
const Home = () => {
  return (
    <div className={styles.homeContainer}>
      {/* Sección Izquierda (texto) */}
      <div className={styles.leftSide}>
        <div className={styles.textBox}>
          <h1 className={styles.title}>PLANNER</h1>
          <h3 className={styles.subtitle}>Greif Software Solutions</h3>
          <p className={styles.description}>
            Organiza tus tareas y proyectos de forma sencilla y eficiente.
            ¡Bienvenido/a a tu nuevo espacio de productividad!
          </p>
          <Link to="/login" className={styles.enterBtn}>
            Ingresar
          </Link>
        </div>
      </div>

      {/* Sección Derecha (imagen o gradiente) */}
      <div className={styles.rightSide}>
        {/* Si quieres mostrar una imagen, descomenta la siguiente línea:
          <img src="https://via.placeholder.com/400x300" alt="Imagen de ejemplo" />
        */}
      </div>
    </div>
  );
};

export default Home;
