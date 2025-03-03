// frontend/src/pages/Contabilidad.jsx
import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Contabilidad = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [nuevoMov, setNuevoMov] = useState({
    tipo: 'FACTURA_EMITIDA',
    monto: 0,
    descripcion: '',
    idObra: '',
    idProveedor: '',
    idCliente: ''
  });

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/contabilidad`);
      const data = await res.json();
      setMovimientos(data);
    } catch (error) {
      console.error("Error al listar movimientos:", error);
    }
  };

  const crearMovimiento = async () => {
    try {
      const res = await fetch(`${API_URL}/api/contabilidad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoMov)
      });
      if (!res.ok) throw new Error('Error al crear movimiento');
      await fetchMovimientos();
      setNuevoMov({ ...nuevoMov, monto: 0, descripcion: '' });
    } catch (error) {
      console.error("Error al crear movimiento:", error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel de Contabilidad</h1>

      <div>
        <h2>Movimientos registrados</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((mov) => (
              <tr key={mov._id}>
                <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                <td>{mov.tipo}</td>
                <td>{mov.monto}</td>
                <td>{mov.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Crear nuevo movimiento</h2>
        <select
          value={nuevoMov.tipo}
          onChange={(e) => setNuevoMov({ ...nuevoMov, tipo: e.target.value })}
        >
          <option value="FACTURA_EMITIDA">Factura Emitida</option>
          <option value="FACTURA_RECIBIDA">Factura Recibida</option>
          <option value="PAGO_RECIBIDO">Pago Recibido</option>
          <option value="PAGO_EMITIDO">Pago Emitido</option>
        </select>
        <input
          type="number"
          placeholder="Monto"
          value={nuevoMov.monto}
          onChange={(e) => setNuevoMov({ ...nuevoMov, monto: Number(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoMov.descripcion}
          onChange={(e) => setNuevoMov({ ...nuevoMov, descripcion: e.target.value })}
        />
        <button onClick={crearMovimiento}>Guardar</button>
      </div>
    </div>
  );
};

export default Contabilidad;
