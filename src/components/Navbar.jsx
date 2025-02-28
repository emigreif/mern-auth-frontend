// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/Navbar.css"; // Mantiene tu estilo actual

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Maneja el logout y redirige al home
  const handleLogout = () => {
    logout(); // Limpia la sesión
    navigate("/"); // Te devuelve a Home
  };

  return (
    <header className="top-nav">
      <div className="nav-left">
        <Link to="/" className="brand">
          PLANNER
        </Link>
      </div>
      <div className="nav-right">
        <nav className="nav-center">
          {!user ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/planner">Planner</Link>
              <a href="#contact">Contact</a>
            </>
          ) : (
            <>
             
              <Link to="/obras">Obras</Link>
                 <Link to="/proveedores">Proveedores</Link>
              <Link to="/panol">Pañol</Link>
              <Link to="/calendario">Calendario</Link>
              <Link to="/Mediciones">Mediciones</Link>
              <Link to="/Compras">Compras</Link>
              <Link to="/Configuracion">Configuracion</Link>
              <Link to="/reportes">Reportes</Link>
            </>
          )}
        </nav>
        {!user ? (
          <Link to="/register" className="signup-btn">
            Sign Up
          </Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
