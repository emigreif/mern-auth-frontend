// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css'; // Mantiene tu estilo actual

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Maneja el logout y redirige al home
  const handleLogout = () => {
    logout();     // Limpia la sesión
    navigate('/'); // Te devuelve a Home
  };

  return (
    <header className="top-nav">
      {/* Izquierda: marca o logo */}
      <div className="nav-left">
        <Link to="/" className="brand">PLANNER</Link>
      </div>

      {/* Derecha: menú centrado + SignUp/Logout */}
      <div className="nav-right">
        {/* Enlaces al centro, cambian si user está logueado */}
        <nav className="nav-center">
          {!user ? (
            <>
              {/* Si NO está logueado => Home, About, Planner, Contact */}
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/planner">Planner</Link>
              <a href="#contact">Contact</a>
            </>
          ) : (
            <>
              {/* Si SÍ está logueado => Rutas del Planner */}
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/obras">Obras</Link>
              <Link to="/proveedores">Proveedores</Link>
              <Link to="/panol">Pañol</Link>
              <Link to="/calendario">Calendario</Link>
              <Link to="/admin">Admin</Link>
              <Link to="/reportes">Reportes</Link>
            </>
          )}
        </nav>

        {/* Botón de Sign Up si no user, o Logout si user */}
        {!user ? (
          <Link to="/register" className="signup-btn">Sign Up</Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
