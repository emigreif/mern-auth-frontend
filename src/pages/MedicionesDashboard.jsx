import React, { useState, useEffect } from "react";
import TableBase from "../components/TableBase.jsx";
import ModalBase from "../components/ModalBase.jsx";
import "../styles/Mediciones.css";

const MedicionesDashboard = () => {
  const [mediciones, setMediciones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaMedicion, setNuevaMedicion] = useState({ obra: "", ubicacion: "", tipo: "", dimensiones: "" });

  const handleInputChange = (e) => {
    setNuevaMedicion({ ...nuevaMedicion, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMediciones([...mediciones, nuevaMedicion]);
    setIsModalOpen(false);
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Mediciones</h1>
        <button onClick={() => setIsModalOpen(true)}>Agregar Medición</button>

        <TableBase
          headers={["Obra", "Ubicación", "Tipo", "Dimensiones"]}
          data={mediciones.map((m) => ({
            Obra: m.obra,
            Ubicación: m.ubicacion,
            Tipo: m.tipo,
            Dimensiones: m.dimensiones,
          }))}
        />

        <ModalBase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Agregar Medición</h2>
          <form onSubmit={handleSubmit}>
            <label>Obra:</label>
            <input type="text" name="obra" value={nuevaMedicion.obra} onChange={handleInputChange} required />
            <label>Ubicación:</label>
            <input type="text" name="ubicacion" value={nuevaMedicion.ubicacion} onChange={handleInputChange} required />
            <label>Tipo:</label>
            <input type="text" name="tipo" value={nuevaMedicion.tipo} onChange={handleInputChange} required />
            <label>Dimensiones:</label>
            <input type="text" name="dimensiones" value={nuevaMedicion.dimensiones} onChange={handleInputChange} required />
            <button type="submit">Guardar</button>
          </form>
        </ModalBase>
      </div>
    </div>
  );
};

export default MedicionesDashboard;
