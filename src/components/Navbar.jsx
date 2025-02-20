import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav>
      <ul>
        <li><Link to='/'>Inicio</Link></li>
        {user ? (
          <>
            <li><Link to='/dashboard'>Dashboard</Link></li>
            <li><button onClick={logout}>Cerrar sesión</button></li>
          </>
        ) : (
          <>
            <li><Link to='/login'>Iniciar sesión</Link></li>
            <li><Link to='/register'>Registrarse</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;