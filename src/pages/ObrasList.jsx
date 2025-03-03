// frontend/src/pages/ObrasList.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const ObrasList = () => {
  const [obras, setObras] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener obras");
        const data = await res.json();
        setObras(data);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };

    if (user) {
      fetchObras();
    }
  }, [API_URL, user]);

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Obras</h1>
        {obras.length === 0 ? (
          <p>No hay obras registradas para este usuario.</p>
        ) : (
          obras.map((obra) => (
            <div key={obra._id} className="obra-card">
              <h2>{obra.nombre}</h2>
              <p>{obra.direccion}</p>
              {/* Agrega otros campos según corresponda */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ObrasList;
