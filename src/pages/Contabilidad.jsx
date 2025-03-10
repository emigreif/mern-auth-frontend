import React, { useState } from "react";
import "../styles/Contabilidad.css";

const Contabilidad = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: "",
    monto: "",
    fecha: "",
  });

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    setNuevoMovimiento({ ...nuevoMovimiento, [e.target.name]: e.target.value });
  };

  // Guardar nuevo movimiento
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nuevoMovimiento.tipo || !nuevoMovimiento.monto || !nuevoMovimiento.fecha) {
      alert("Todos los campos son obligatorios");
      return;
    }

    setMovimientos([...movimientos, nuevoMovimiento]);

    // Resetear formulario
    setNuevoMovimiento({ tipo: "", monto: "", fecha: "" });
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Contabilidad</h1>

        {/* 📋 Lista de Movimientos */}
        {movimientos.length === 0 ? (
          <p>No hay movimientos registrados.</p>
        ) : (
          <div className="movimientos-list">
            {movimientos.map((m, index) => (
              <div key={index} className="movimiento-card">
                <h3>{m.tipo}</h3>
                <p><strong>Monto:</strong> ${m.monto}</p>
                <p><strong>Fecha:</strong> {new Date(m.fecha).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* ➕ Formulario para agregar movimiento */}
        <h2>Agregar Movimiento</h2>
        <form onSubmit={handleSubmit} className="formulario">
          <label>Tipo:</label>
          <select name="tipo" value={nuevoMovimiento.tipo} onChange={handleInputChange} required>
            <option value="">Seleccionar</option>
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
          </select>

          <label>Monto:</label>
          <input type="number" name="monto" value={nuevoMovimiento.monto} onChange={handleInputChange} required />

          <label>Fecha:</label>
          <input type="date" name="fecha" value={nuevoMovimiento.fecha} onChange={handleInputChange} required />

          <button type="submit">Agregar Movimiento</button>
        </form>
      </div>
    </div>
  );
};

export default Contabilidad;
