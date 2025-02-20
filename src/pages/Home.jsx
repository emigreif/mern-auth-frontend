/* // frontend/src/pages/Home.jsx
import { Link } from 'react-router-dom';
import './Home.css'; // opcional si quieres separar los estilos

const Home = () => {
return (
<div className="home-container">
  <div className="home-content">
    <h1>Planner de Greif Software Solutions</h1>
    <p>
      ¡Bienvenido/a! Nos alegra verte por aquí. En nuestra plataforma podrás organizar tus tareas y proyectos de forma sencilla y eficiente.
    </p>
    <p>
      ¿Ya tienes una cuenta? <Link to="/login" className="home-link">Inicia sesión</Link> 
      <br />
      ¿Aún no te has registrado? <Link to="/register" className="home-link">Crea tu cuenta</Link> para acceder al dashboard.
    </p>
  </div>
</div>
);
};

export default Home;
 */
import { Link } from 'react-router-dom';
import './Home.css'; // Importa un CSS propio para Home, si prefieres separar estilos

const Home = () => {
  return (
    <div className="home-container">
      {/* Sección Izquierda (Blanca) */}
      <div className="home-left">
        <div className="home-text">
          <h1 className="planner-title">PLANNER</h1>
          <h3 className="griff-subtitle">Greif Software Solutions</h3>
          <p className="home-description">
            Organiza tus tareas y proyectos de forma sencilla y eficiente. 
            ¡Bienvenido/a a tu nuevo espacio de productividad!
          </p>
          <Link to="/login" className="home-button">
            Continuar
          </Link>
        </div>
      </div>

      {/* Sección Derecha (Verde / Ilustración) */}
      <div className="home-right">
        {/* Opcional: imagen o SVG decorativo */}
        {/* <img src="/assets/imagen-ilustracion.svg" alt="Ilustración" /> */}
      </div>
    </div>
  );
};

export default Home;
