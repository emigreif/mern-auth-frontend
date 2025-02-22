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
      navigate("/dashboard"); // Solo si el login fue exitoso
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
          <button type="submit">Signin</button>
          <p className="or-social">or signin with</p>
          <div className="social-icons">
            <span>F</span>
            <span>G</span>
            <span>in</span>
          </div>
        </form>
      </div>

      {/* Lado derecho: Mensaje de bienvenida */}
      <div className="auth-right">
        <h2>Welcome back!</h2>
        <p>
          We are so happy to have you here. It’s great to see you again. We hope
          you had a safe and enjoyable time away.
        </p>
        <Link to="/register" className="signup-button">
          No account yet? Signup.
        </Link>
      </div>
    </div>
  );
};

export default Login;
