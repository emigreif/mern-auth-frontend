import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="top-nav">
      <div className="nav-left">
        <Link to="/" className="brand">PLANNER</Link>
      </div>

      {/* Si el usuario NO está logueado, muestra login/register */}
      {!user && (
        <div className="nav-right">
          <Link to="/" className="nav-comp ">home</Link>
          <Link to="/about" className="nav-comp">about</Link>
          <Link to="/planner" className="nav-comp">Planner</Link>     
          <Link to="/login" className="signup-btn">Login</Link>
          <Link to="/register" className="signup-btn">Sign Up</Link>
          </div>
          
      )}
    </header>
  );
};

export default Navbar;
