/* import { useState } from "react";
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
      // Lado izquierdo: Formulario 
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

     // Lado derecho: Mensaje de bienvenida 
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
 */

/////////////////////////////////////////////////////////////////////////////////////////////
/* import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/auth.css";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    newPassword: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "https://mern-auth-backend.onrender.com";

  useEffect(() => {
    if (user) {
      setFormData({ nombre: user.nombre || "", email: user.email || "" });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error actualizando perfil");

      alert("Perfil actualizado");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Mi Perfil</h1>

        <label>Nombre</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} disabled />

        <label>Contraseña Actual</label>
        <input type="password" name="password" placeholder="Solo si cambias la contraseña" value={formData.password} onChange={handleChange} />

        <label>Nueva Contraseña</label>
        <input type="password" name="newPassword" placeholder="Solo si cambias la contraseña" value={formData.newPassword} onChange={handleChange} />

        <button onClick={handleUpdateProfile}>Actualizar</button>
      </div>
    </div>
  );
};

export default Profile;
 */

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import PerfilSelector from "../components/PerfilSelector.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [perfiles, setPerfiles] = useState([]);
  const [selectedPerfil, setSelectedPerfil] = useState(null);
  const [showPerfilSelector, setShowPerfilSelector] = useState(false);
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await login(email, password);
    
    if (response && response.perfiles.length > 1) {
      setPerfiles(response.perfiles);
      setShowPerfilSelector(true);
    } else if (response) {
      setUser(response);
      navigate("/obras");
    } else {
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  const handlePerfilSelect = (perfil) => {
    setSelectedPerfil(perfil);
    setUser((prev) => ({ ...prev, perfilSeleccionado: perfil }));
    navigate("/obras");
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
              <Link to="/forgot-password" className="hidebutton">Recuperar contraseña</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Lado derecho: Mensaje de bienvenida */}
      <div className="auth-right">
        <h1 className="h1blanco">Bienvenido a PLANNER</h1>
        <p>La herramienta pensada para tu empresa. Estás a un paso de potenciar al máximo tu productividad.</p>
        <Link to="/register" className="nonButtonButton">¿Aún no tienes cuenta? Regístrate</Link>
      </div>

      {/* Modal de selección de perfil */}
      {showPerfilSelector && <PerfilSelector perfiles={perfiles} onSelectPerfil={handlePerfilSelect} />}
    </div>
  );
};

export default Login;
