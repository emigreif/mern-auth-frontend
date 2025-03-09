import React, { useState } from "react";
import "../styles/Configuracion.css";

const Configuracion = () => {
  const [config, setConfig] = useState({
    impuestos: "",
    produccion: "",
  });

  const handleInputChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Configuración guardada");
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Configuración</h1>
        <form onSubmit={handleSubmit}>
          <label>Impuestos (%):</label>
          <input type="number" name="impuestos" value={config.impuestos} onChange={handleInputChange} required />

          <label>Producción Máxima:</label>
          <input type="number" name="produccion" value={config.produccion} onChange={handleInputChange} required />

          <button type="submit">Guardar Configuración</button>
        </form>
      </div>
    </div>
  );
};

export default Configuracion;
