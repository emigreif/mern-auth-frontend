// frontend/src/pages/Register.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="auth-container reverse-layout">
      {/* Sección Izquierda: Fondo Verde */}
      <div className="auth-left-green">
        <h2 className="register-title">¡Bienvenido!</h2>
        <p className="register-message">
          Únete a nuestra plataforma y disfruta de una experiencia única. <br />
          ¿Ya tienes cuenta? <Link to="/login" className="white-link">Inicia Sesión</Link>
        </p>
      </div>

      {/* Sección Derecha: Formulario en Blanco */}
      <div className="auth-right-white">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Registrarse</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Crear cuenta</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
