import { Link } from 'react-router-dom';
import '../styles/Home.css';

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
