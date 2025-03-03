// frontend/src/pages/Mediciones.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Mediciones = () => {
  const [mediciones, setMediciones] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMediciones = async () => {
      try {
        const res = await fetch(`${API_URL}/api/mediciones`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener mediciones");
        const data = await res.json();
        setMediciones(data);
      } catch (error) {
        console.error("Error fetching mediciones:", error);
      }
    };

    if (user) {
      fetchMediciones();
    }
  }, [API_URL, user]);

  return (
    <div className="mediciones-container">
      <h1>Mediciones</h1>
      {mediciones.length === 0 ? (
        <p>No hay mediciones registradas.</p>
      ) : (
        mediciones.map((med) => (
          <div key={med._id} className="medicion-card">
            <p>{med.descripcion}</p>
            {/* Muestra más información según el modelo */}
          </div>
        ))
      )}
    </div>
  );
};

export default Mediciones;
