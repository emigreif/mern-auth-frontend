// import React from 'react';
// import '../styles/Obras.css';

// const ObrasList = () => {
//   return (
//     <div className="obras-background">
//       <div className="obras-container">
//         <h1>Lista de Obras</h1>
//         <p>Aquí irán todas las obras con paginación, filtrado, etc.</p>

//         {/* Ejemplo de tabla o tarjetas */}
//         <div className="obras-list">
//           {/* Mapea tus obras y muestra la info */}
//           <div className="obra-item">Obra #1 - Cliente X - Estado: ...</div>
//           <div className="obra-item">Obra #2 - Cliente Y - Estado: ...</div>
//           {/* etc. */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ObrasList;



// frontend/src/pages/ObrasList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ObrasList.css';

const ObrasList = () => {
  const [obras, setObras] = useState([]);
  const [filteredObras, setFilteredObras] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Simulación de datos (esto luego vendrá del backend)
    const obrasEjemplo = [
      {
        id: 1,
        nombre: 'Construcción Casa Norte',
        direccion: 'Calle Falsa 123, Ciudad',
        contacto: 'Juan Pérez - 123456789',
        ubicacion: 'https://maps.google.com',
        estados: { accesorios: true, vidrios: true, perfiles: false },
      },
      {
        id: 2,
        nombre: 'Edificio Central',
        direccion: 'Avenida Siempre Viva 742, Capital',
        contacto: 'Ana García - 987654321',
        ubicacion: 'https://maps.google.com',
        estados: { accesorios: true, vidrios: true, perfiles: true },
      }
    ];

    setObras(obrasEjemplo);
    setFilteredObras(obrasEjemplo);
  }, []);

  // Filtrado de obras
  useEffect(() => {
    setFilteredObras(
      obras.filter((obra) => 
        obra.nombre.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, obras]);

  return (
    <div className="obras-container">
      <div className="header">
        <h1>Lista de Obras</h1>
        <input
          type="text"
          placeholder="Buscar obra..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/obras/nueva" className="add-button">+ Agregar Obra</Link>
      </div>

      <div className="obras-list">
        {filteredObras.length > 0 ? (
          filteredObras.map((obra) => (
            <div key={obra.id} className="obra-card">
              <h2>#{obra.id} - {obra.nombre}</h2>
              <p>{obra.direccion} - {obra.contacto}</p>
              <a href={obra.ubicacion} target="_blank" rel="noopener noreferrer" className="location-icon">
                📍
              </a>
              <div className="estados">
                <span className={obra.estados.accesorios ? 'ok' : 'pending'}>Accesorios</span>
                <span className={obra.estados.vidrios ? 'ok' : 'pending'}>Vidrios</span>
                <span className={obra.estados.perfiles ? 'ok' : 'pending'}>Perfiles</span>
                <span className={
                  obra.estados.accesorios && obra.estados.vidrios && obra.estados.perfiles
                    ? 'ok' : 'pending'}>
                  Listo para producir
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron obras</p>
        )}
      </div>
    </div>
  );
};

export default ObrasList;
