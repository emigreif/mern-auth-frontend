// frontend/src/pages/Contabilidad.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Contabilidad = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [nuevoMov, setNuevoMov] = useState({
    tipo: "FACTURA_EMITIDA",
    monto: 0,
    descripcion: ""
  });
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/contabilidad`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener movimientos");
        const data = await res.json();
        setMovimientos(data);
      } catch (error) {
        console.error("Error fetching movimientos:", error);
      }
    };

    if (user) {
      fetchMovimientos();
    }
  }, [API_URL, user]);

  const crearMovimiento = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/contabilidad`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(nuevoMov)
      });
      if (!res.ok) throw new Error("Error al crear movimiento");
      // Recargar movimientos
      const updated = await fetch(`${API_URL}/api/contabilidad`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await updated.json();
      setMovimientos(data);
      setNuevoMov({ ...nuevoMov, monto: 0, descripcion: "" });
    } catch (error) {
      console.error("Error creando movimiento:", error);
    }
  };

  return (
    <div className="page-contenedor">
      <h1>Contabilidad</h1>
      <h2>Movimientos Registrados</h2>
      <table>
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
              <td>{mov.fecha ? new Date(mov.fecha).toLocaleDateString() : "N/A"}</td>
              <td>{mov.tipo}</td>
              <td>{mov.monto}</td>
              <td>{mov.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Crear Nuevo Movimiento</h2>
      <form onSubmit={crearMovimiento}>
        <select value={nuevoMov.tipo} onChange={(e) => setNuevoMov({ ...nuevoMov, tipo: e.target.value })}>
          <option value="FACTURA_EMITIDA">Factura Emitida</option>
          <option value="FACTURA_RECIBIDA">Factura Recibida</option>
          <option value="PAGO_RECIBIDO">Pago Recibido</option>
          <option value="PAGO_EMITIDO">Pago Emitido</option>
        </select>
        <input type="number" placeholder="Monto" value={nuevoMov.monto} onChange={(e) => setNuevoMov({ ...nuevoMov, monto: Number(e.target.value) })} />
        <input type="text" placeholder="Descripción" value={nuevoMov.descripcion} onChange={(e) => setNuevoMov({ ...nuevoMov, descripcion: e.target.value })} />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default Contabilidad;
