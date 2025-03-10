// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-contenedor">
      <div className="home-left">
        <div className="home-text">
          <h1 className="planner-title">PLANNER</h1>
          <h3 className="greif-subtitle">Greif Software Solutions</h3>
          <p className="home-description">
            Organiza tus tareas y proyectos de forma sencilla y eficiente.
            ¡Bienvenido/a a tu nuevo espacio de productividad!
          </p>
          <Link to="/login" className="nonButtonButton">
            Ingresar
          </Link>
        </div>
      </div>
      <div className="home-right">{/* Opcional: imagen, logo, etc. */}</div>
    </div>
  );
};

export default Home;
