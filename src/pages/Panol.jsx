// frontend/src/pages/Panol.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Panol = () => {
  const [panol, setPanol] = useState(null);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPanol = async () => {
      try {
        const res = await fetch(`${API_URL}/api/panol`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener datos del panol");
        const data = await res.json();
        setPanol(data);
      } catch (error) {
        console.error("Error fetching panol:", error);
      }
    };

    if (user) {
      fetchPanol();
    }
  }, [API_URL, user]);

  if (!panol) return <div>Cargando datos del panol...</div>;

  return (
    <div className="page-contenedor">
      <h1>Pañol</h1>
      <h2>Herramientas</h2>
      {panol.herramientas && panol.herramientas.map((item) => (
        <div key={item._id} className="panol-card">
          <p><strong>{item.descripcion}</strong></p>
          <p>Marca: {item.marca} | Modelo: {item.modelo}</p>
          <p>ID: {item.identificacion}</p>
        </div>
      ))}
      <h2>Perfiles</h2>
      {panol.perfiles && panol.perfiles.map((item) => (
        <div key={item._id} className="panol-card">
          <p><strong>{item.descripcion}</strong></p>
          <p>Código: {item.codigo} | Cantidad: {item.cantidad}</p>
          <p>Largo: {item.largo} | Color: {item.color}</p>
        </div>
      ))}
      <h2>Accesorios</h2>
      {panol.accesorios && panol.accesorios.map((item) => (
        <div key={item._id} className="panol-card">
          <p><strong>{item.descripcion}</strong></p>
          <p>Código: {item.codigo} | Cantidad: {item.cantidad}</p>
          <p>Color: {item.color} | Marca: {item.marca}</p>
        </div>
      ))}
    </div>
  );
};

export default Panol;
