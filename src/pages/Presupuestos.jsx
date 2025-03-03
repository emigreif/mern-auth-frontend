// frontend/src/pages/Presupuestos.jsx
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Presupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [nuevo, setNuevo] = useState({
    descripcion: "",
    totalBlanco: 0,
    totalNegro: 0,
    fechaEntrega: ""
  });

  useEffect(() => {
    fetchPresupuestos();
  }, []);

  const fetchPresupuestos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/presupuestos`);
      const data = await res.json();
      setPresupuestos(data);
    } catch (error) {
      console.error("Error al obtener presupuestos:", error);
    }
  };

  const crearPresupuesto = async () => {
    try {
      const res = await fetch(`${API_URL}/api/presupuestos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo)
      });
      if (!res.ok) throw new Error("Error al crear presupuesto");
      await fetchPresupuestos();
      setNuevo({ descripcion: "", totalBlanco: 0, totalNegro: 0, fechaEntrega: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Listado de Presupuestos</h1>
      <ul>
        {presupuestos.map((p) => (
          <li key={p._id}>{p.descripcion} - {p.estado} - {p.totalBlanco}</li>
        ))}
      </ul>

      <h2>Crear nuevo</h2>
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
  );
};

export default Presupuestos;
