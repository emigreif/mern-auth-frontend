import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='p-4'>
      <h1 className='text-3xl'>Bienvenido a la App</h1>
      <Link to='/login' className='mt-4 bg-blue-500 text-white p-2 rounded'>Iniciar sesión</Link>
      <Link to='/register' className='mt-4 bg-green-500 text-white p-2 rounded'>Registrarse</Link>
    </div>
  );
};

export default Home;