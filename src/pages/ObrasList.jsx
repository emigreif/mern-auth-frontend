import React, { useState } from "react";
import "../styles/ObrasList.css";

const ObrasList = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState(""); // Estado para el buscador
  const [obras, setObras] = useState([
    {
      id: 1,
      nombre: "Edificio Central",
      direccion: "Av. Principal 123",
      contacto: "Juan Pérez - 123456789",
      mapa: "https://www.google.com/maps",
      estado: {
        perfiles: "pendiente",
        vidrios: "proximo",
        accesorios: "cumplido",
        produccion: "pendiente",
        medicion: "pendiente",
        aprobada: "cumplido"
      },
      fechaEntrega: "2024-07-15",
      saldo: "Con saldo a cobrar",
    },
    {
      id: 2,
      nombre: "Residencial Las Palmas",
      direccion: "Calle Secundaria 456",
      contacto: "María Gómez - 987654321",
      mapa: "https://www.google.com/maps",
      estado: {
        perfiles: "cumplido",
        vidrios: "pendiente",
        accesorios: "proximo",
        produccion: "pendiente",
        medicion: "proximo",
        aprobada: "pendiente"
      },
      fechaEntrega: "2024-08-10",
      saldo: "Pagada",
    },
    {
      id: 3,
      nombre: "Torre Norte",
      direccion: "Av. Libertador 789",
      contacto: "Carlos López - 456123789",
      mapa: "https://www.google.com/maps",
      estado: {
        perfiles: "proximo",
        vidrios: "cumplido",
        accesorios: "pendiente",
        produccion: "pendiente",
        medicion: "cumplido",
        aprobada: "cumplido"
      },
      fechaEntrega: "2024-09-05",
      saldo: "Con saldo a cobrar",
    }
  ]);

  // Filtrar obras por nombre o dirección
  const filteredObras = obras.filter((obra) =>
    obra.nombre.toLowerCase().includes(search.toLowerCase()) ||
    obra.direccion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="obras-container">
      <div className="obras-list-wrapper">
        {/* Título principal */}
        <h1 className="obras-title">Lista de Obras</h1>

        {/* Buscador y botón */}
        <div className="header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar obra..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="add-button" onClick={() => setShowModal(true)}>
            Agregar Nueva Obra
          </button>
        </div>

        {/* Lista de Obras */}
        <div className="obras-list">
          {filteredObras.map((obra) => (
            <div key={obra.id} className="obra-card">
              {/* Primera línea: ID, Nombre y Fecha */}
              <div className="obra-header">
                <span className="obra-id-nombre">{`${obra.id} - ${obra.nombre}`}</span>
                <span className="obra-fecha">Entrega: {obra.fechaEntrega}</span>
              </div>

              {/* Segunda línea: Dirección + Icono de Mapa */}
              <div className="obra-info">
                <span>{obra.direccion}</span>
                <a href={obra.mapa} target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e2/Maps_icon.svg"
                    alt="Ubicación"
                    className="location-icon"
                  />
                </a>
              </div>

              {/* Contacto */}
              <div className="obra-contacto">{obra.contacto}</div>

              {/* Estados en una sola línea */}
              <div className="estados">
                <span className={`estado-${obra.estado.perfiles}`}>Perfiles</span>
                <span className={`estado-${obra.estado.vidrios}`}>Vidrios</span>
                <span className={`estado-${obra.estado.accesorios}`}>Accesorios</span>
                <span className={`estado-${obra.estado.medicion}`}>Medición</span>
                <span className={`estado-${obra.estado.aprobada}`}>OP Aprobada Cliente</span>
                
                <span className={`estado-${obra.estado.produccion}`}>Listo para Producir</span>
              </div>

              {/* Última línea: Saldo */}
              <div className="obra-footer">
                <span>{obra.saldo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar nueva obra */}
      {showModal && (
        <div className="modal-background" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h2>Agregar Nueva Obra</h2>
            <input type="text" placeholder="Nombre de la obra" />
            <input type="text" placeholder="Dirección" />
            <input type="text" placeholder="Contacto" />
            <input type="date" placeholder="Fecha de Entrega" />
            <button onClick={() => setShowModal(false)}>Guardar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObrasList;
