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
        <div className="borde">
          <form onSubmit={handleSubmit}>
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
            <Link to="/forgot-password" className="hidebutton">recuperar contraseña</Link>
          </div>
        </form>
      </div>
      </div>

      {/* Lado derecho: Mensaje de bienvenida */}
      <div className="auth-right">
        <h1 className="h1blanco" >Bienvenido a PLANNER</h1>
        <p>
          La herramienta pensada para tu empresa.
          Estas a un paso de potenciar al maximo tu pruductividad </p>
        <Link to="/register" className="nonButtonButton">
          ¿Aun no tenes cuenta? Vamos
        </Link>
      </div>
    </div>
  );
};

export default Login;
