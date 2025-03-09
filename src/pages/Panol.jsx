import React, { useState, useEffect } from "react";
import TableBase from "../components/TableBase.jsx";
import ModalBase from "../components/ModalBase.jsx";
import "../styles/Panol.css";

const Panol = () => {
  const [herramientas, setHerramientas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaHerramienta, setNuevaHerramienta] = useState({ nombre: "", estado: "Disponible" });

  const handleInputChange = (e) => {
    setNuevaHerramienta({ ...nuevaHerramienta, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHerramientas([...herramientas, nuevaHerramienta]);
    setIsModalOpen(false);
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Pañol</h1>
        <button onClick={() => setIsModalOpen(true)}>Agregar Herramienta</button>

        <TableBase
          headers={["Nombre", "Estado"]}
          data={herramientas.map((h) => ({
            Nombre: h.nombre,
            Estado: h.estado,
          }))}
        />

        <ModalBase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Agregar Herramienta</h2>
          <form onSubmit={handleSubmit}>
            <label>Nombre:</label>
            <input type="text" name="nombre" value={nuevaHerramienta.nombre} onChange={handleInputChange} required />
            <label>Estado:</label>
            <select name="estado" value={nuevaHerramienta.estado} onChange={handleInputChange} required>
              <option value="Disponible">Disponible</option>
              <option value="En uso">En uso</option>
              <option value="En reparación">En reparación</option>
            </select>
            <button type="submit">Guardar</button>
          </form>
        </ModalBase>
      </div>
    </div>
  );
};

export default Panol;
