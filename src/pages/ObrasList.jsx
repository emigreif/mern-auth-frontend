import React, { useState } from "react";
import "../styles/ObrasList.css";

const ObrasList = () => {
  const [showModal, setShowModal] = useState(false);
  const [obras, setObras] = useState([
    {
      id: 1,
      nombre: "Edificio Central",
      direccion: "Av. Principal 123",
      contacto: "Juan Pérez - 123456789",
      mapa: "https://www.google.com/maps",
      estado: { perfiles: "pendiente", vidrios: "proximo", accesorios: "cumplido", produccion: "pendiente" },
      fechaEntrega: "2024-07-15",
      saldo: "Con saldo a cobrar",
    },
  ]);

  return (
    <div className="obras-container">
      <div className="header">
        <h1>Lista de Obras</h1>
        <button className="add-button" onClick={() => setShowModal(true)}>
          Agregar Nueva Obra
        </button>
      </div>
      <div className="obras-list">
        {obras.map((obra) => (
          <div key={obra.id} className="obra-card">
            <div className="obra-header">
              <span className="obra-id">{`#${obra.id}`}</span>
              <span className="obra-nombre">{obra.nombre}</span>
              <span className="obra-entrega">Entrega: {obra.fechaEntrega}</span>
            </div>
            <div className="obra-info">
              <span>{obra.direccion}</span>
              <a href={obra.mapa} target="_blank" rel="noopener noreferrer" className="location-link">
                📍
              </a>
            </div>
            <div className="obra-contacto">{obra.contacto}</div>
            <div className="estados">
              <div className="estado-group">
                <span className={`estado ${obra.estado.perfiles}`}>Perfiles</span>
                <span className={`estado ${obra.estado.vidrios}`}>Vidrios</span>
                <span className={`estado ${obra.estado.accesorios}`}>Accesorios</span>
              </div>
              <span className={`estado produccion ${obra.estado.produccion}`}>Listo para Producir</span>
            </div>
            <div className="obra-footer">
              <span>{obra.saldo}</span>
            </div>
          </div>
        ))}
      </div>
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
