import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      navigate("/obras"); // Solo si el login fue exitoso
    } else {
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <div className="auth-container">
      {/* Lado izquierdo: Formulario */}
      <div className="auth-left">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign-in</button>
               <div>
            <Link to="/forgot-password">"recuperar contraseña"</Link>
          </div>
        </form>
      </div>

      {/* Lado derecho: Mensaje de bienvenida */}
      <div className="auth-right">
        <h1 >Bienvenido nuevamente</h1>
        <p>
          Estas a un paso de potenciar la pruductividas de la empresa
        </p>
        <Link to="/register" className="signup-button">
          ¿Aun no tenes cuenta? Vamos
        </Link>
      </div>
    </div>
  );
};

export default Login;
