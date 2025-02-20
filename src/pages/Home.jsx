import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenido a la App</h1>
      <Link to='/login'>Iniciar sesión</Link>
      <Link to='/register'>Registrarse</Link>
    </div>
  );
};

export default Home;