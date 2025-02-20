// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css'; // Asegúrate de crear este archivo

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="top-nav">
      {/* Izquierda: marca o logo */}
      <div className="nav-left">
        <Link to="/" className="brand">PLANNER</Link>
      </div>

      {/* Derecha: menú centrado + Sign Up o Dashboard */}
      <div className="nav-right">
        <nav className="nav-center">
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/register" className="signup-btn">Sign Up</Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
