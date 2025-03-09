import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    repeatPassword: '',
    firstName: '',
    lastName: '',
    razonSocial: '',
    cuit: '',
    plan: '',
    cantidadUsuarios: '',
    direccion: '',
    localidad: '',
    codigoPostal: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
    navigate('/Obras');
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <form  onSubmit={handleSubmit}>
          <h2>Registrarse</h2>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} required />
          <input type="text" name="razonSocial" placeholder="Razón Social (opcional)" value={formData.razonSocial} onChange={handleChange} />
          <input type="text" name="cuit" placeholder="CUIT" value={formData.cuit} onChange={handleChange} />
          <input type="text" name="plan" placeholder="Plan (Básico, Premium, etc.)" value={formData.plan} onChange={handleChange} />
          <input type="number" name="cantidadUsuarios" placeholder="Cantidad de Usuarios" value={formData.cantidadUsuarios} onChange={handleChange} />
          <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />
          <input type="text" name="localidad" placeholder="Localidad" value={formData.localidad} onChange={handleChange} />
          <input type="text" name="codigoPostal" placeholder="Código Postal" value={formData.codigoPostal} onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
          <input type="password" name="repeatPassword" placeholder="Repetir Contraseña" value={formData.repeatPassword} onChange={handleChange} required />
          <button type="submit">Crear cuenta</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
