import React, { useState, useEffect } from "react";
import TableBase from "../components/TableBase.jsx";
import FormBase from "../components/FormBase.jsx";
import "../styles/Contabilidad.css";

const Contabilidad = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({ tipo: "", monto: "", fecha: "" });

  const handleInputChange = (e) => {
    setNuevoMovimiento({ ...nuevoMovimiento, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMovimientos([...movimientos, nuevoMovimiento]);
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Contabilidad</h1>

        <TableBase
          headers={["Tipo", "Monto", "Fecha"]}
          data={movimientos.map((m) => ({
            Tipo: m.tipo,
            Monto: `$${m.monto}`,
            Fecha: m.fecha,
          }))}
        />

        <h2>Agregar Movimiento</h2>
        <FormBase onSubmit={handleSubmit}>
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
        </FormBase>
      </div>
    </div>
  );
};

export default Contabilidad;
