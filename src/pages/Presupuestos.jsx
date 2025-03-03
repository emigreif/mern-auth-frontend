// frontend/src/pages/Presupuestos.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Presupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [nuevo, setNuevo] = useState({
    descripcion: "",
    totalBlanco: 0,
    totalNegro: 0,
    fechaEntrega: ""
  });
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/presupuestos`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener presupuestos");
        const data = await res.json();
        setPresupuestos(data);
      } catch (error) {
        console.error("Error fetching presupuestos:", error);
      }
    };

    if (user) {
      fetchPresupuestos();
    }
  }, [API_URL, user]);

  const crearPresupuesto = async () => {
    try {
      const res = await fetch(`${API_URL}/api/presupuestos`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(nuevo)
      });
      if (!res.ok) throw new Error("Error al crear presupuesto");
      await fetchPresupuestos();
      setNuevo({ descripcion: "", totalBlanco: 0, totalNegro: 0, fechaEntrega: "" });
    } catch (error) {
      console.error("Error creando presupuesto:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Presupuestos</h1>
        <table>
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
                <td>{p.estadoPresupuesto || "pendiente"}</td>
                <td>${p.totalBlanco}</td>
                <td>{p.fechaEntrega ? p.fechaEntrega.slice(0, 10) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Crear nuevo presupuesto</h2>
        <div className="nuevo-presupuesto">
          <input type="text" placeholder="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
          <input type="number" placeholder="Total Blanco" value={nuevo.totalBlanco} onChange={(e) => setNuevo({ ...nuevo, totalBlanco: Number(e.target.value) })} />
          <input type="number" placeholder="Total Negro" value={nuevo.totalNegro} onChange={(e) => setNuevo({ ...nuevo, totalNegro: Number(e.target.value) })} />
          <input type="date" value={nuevo.fechaEntrega} onChange={(e) => setNuevo({ ...nuevo, fechaEntrega: e.target.value })} />
          <button onClick={crearPresupuesto}>Crear</button>
        </div>
      </div>
    </div>
  );
};

export default Presupuestos;
