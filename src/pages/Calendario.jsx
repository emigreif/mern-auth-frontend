import React, { useState } from "react";
import "../styles/Calendario.css";

const Calendario = () => {
  const [eventos, setEventos] = useState([
    { id: 1, fecha: "2024-06-10", tipo: "Medición", obra: "Edificio Central" },
    { id: 2, fecha: "2024-06-15", tipo: "Producción", obra: "Residencial Norte" },
    { id: 3, fecha: "2024-06-20", tipo: "Entrega", obra: "Torre Este" },
    { id: 4, fecha: "2024-06-25", tipo: "Montaje", obra: "Oficinas Sur" }
  ]);

  return (
    <div className="calendario-background">
      <div className="calendario-container">
        <h1>Calendario de Producción</h1>
        <div className="calendario">
          {eventos.map((evento) => (
            <div key={evento.id} className={`evento ${evento.tipo.toLowerCase()}`}>
              <span className="fecha">{evento.fecha}</span>
              <span className="tipo">{evento.tipo}</span>
              <span className="obra">{evento.obra}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendario;
