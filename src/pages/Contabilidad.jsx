// src/pages/Contabilidad.jsx
import React, { useState, useEffect } from "react";

const Contabilidad = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [movimientos, setMovimientos] = useState([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: "FACTURA_EMITIDA", // Ejemplo
    monto: 0,
    descripcion: "",
  });

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/contabilidad`, {
          headers: {
  "Authorization": `Bearer ${token}`
},
        });
        if (!res.ok) throw new Error("Error al obtener movimientos");
        const data = await res.json();
        setMovimientos(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovimientos();
  }, [API_URL]);

  const handleInputChange = (e) => {
    setNuevoMovimiento({ ...nuevoMovimiento, [e.target.name]: e.target.value });
  };

  const handleCreateMovimiento = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/contabilidad`, {
        method: "POST",
        headers: {
  "Authorization": `Bearer ${token}`
},
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoMovimiento),
      });
      if (!res.ok) throw new Error("Error al crear movimiento");
      const data = await res.json();
      setMovimientos([...movimientos, data]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
   
      <div className="page-contenedor">
        <h1>Contabilidad</h1>

        {/* Lista de Movimientos */}
        <div className="list">
          {movimientos.map((m) => (
            <div key={m._id} className="list-item">
              <h3>{m.tipo}</h3>
              <p>
                <strong>Monto:</strong> {m.monto}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(m.fecha).toLocaleDateString()}
              </p>
              <p>
                <strong>Descripción:</strong> {m.descripcion}
              </p>
            </div>
          ))}
        </div>

        {/* Form para agregar movimiento */}
        <form onSubmit={handleCreateMovimiento} className="formulario">
          <h2>Agregar Movimiento</h2>
          <div className="form-group">
            <label>Tipo</label>
            <select name="tipo" onChange={handleInputChange}>
              <option value="FACTURA_EMITIDA">Factura Emitida</option>
              <option value="FACTURA_RECIBIDA">Factura Recibida</option>
              <option value="PAGO_RECIBIDO">Pago Recibido</option>
              <option value="PAGO_EMITIDO">Pago Emitido</option>
            </select>
          </div>
          <div className="form-group">
            <label>Monto</label>
            <input type="number" name="monto" onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              name="descripcion"
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn">
            Agregar
          </button>
        </form>
      </div>
   
  );
};

export default Contabilidad;
