// frontend/src/pages/Presupuestos.jsx
import React, { useState, useEffect } from "react";
import "../styles/Presupuestos.css"; // Asegúrate de tener el CSS

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Presupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [nuevo, setNuevo] = useState({
    descripcion: "",
    totalBlanco: 0,
    totalNegro: 0,
    fechaEntrega: ""
    // estadoPresupuesto: "pendiente" // <- Si quieres enviarlo desde aquí
  });

  // Al montar el componente, cargar la lista de presupuestos
  useEffect(() => {
    fetchPresupuestos();
  }, []);

  // GET: obtener la lista
  const fetchPresupuestos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/presupuestos`);
      if (!res.ok) throw new Error("Error al obtener presupuestos");
      const data = await res.json();
      setPresupuestos(data);
    } catch (error) {
      console.error(error);
    }
  };

  // POST: crear uno nuevo
  const crearPresupuesto = async () => {
    try {
      const res = await fetch(`${API_URL}/api/presupuestos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo)
      });
      if (!res.ok) throw new Error("Error al crear presupuesto");
      // Refrescar la lista
      await fetchPresupuestos();
      // Limpiar formulario
      setNuevo({ descripcion: "", totalBlanco: 0, totalNegro: 0, fechaEntrega: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="presupuestos-background">
      <div className="presupuestos-container">
        <h1>Listado de Presupuestos</h1>

        {/* Ejemplo con tabla */}
        <table className="presupuestos-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Total Blanco</th>
              <th>Fecha Entrega</th>
            </tr>
          </thead>
          <tbody>
            {presupuestos.map((p) => (
              <tr key={p._id}>
                <td>{p.descripcion}</td>
                <td>
                  {/* Ajusta si tu backend lo llama estadoPresupuesto o estado */}
                  <span className={`presupuesto-estado ${p.estadoPresupuesto || 'pendiente'}`}>
                    {p.estadoPresupuesto}
                  </span>
                </td>
                <td>${p.totalBlanco}</td>
                <td>{p.fechaEntrega ? p.fechaEntrega.slice(0,10) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Crear nuevo presupuesto</h2>
        <div className="nuevo-presupuesto">
          <input
            type="text"
            placeholder="Descripción"
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
          />
          <input
            type="number"
            placeholder="Total Blanco"
            value={nuevo.totalBlanco}
            onChange={(e) => setNuevo({ ...nuevo, totalBlanco: Number(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Total Negro"
            value={nuevo.totalNegro}
            onChange={(e) => setNuevo({ ...nuevo, totalNegro: Number(e.target.value) })}
          />
          <input
            type="date"
            value={nuevo.fechaEntrega}
            onChange={(e) => setNuevo({ ...nuevo, fechaEntrega: e.target.value })}
          />
          <button onClick={crearPresupuesto}>Crear</button>
        </div>
      </div>
    </div>
  );
};

export default Presupuestos;
