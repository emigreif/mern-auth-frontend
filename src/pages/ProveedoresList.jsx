// frontend/src/pages/ProveedoresList.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const ProveedoresList = () => {
  const [proveedores, setProveedores] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await fetch(`${API_URL}/api/proveedores`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener proveedores");
        const data = await res.json();
        setProveedores(data);
      } catch (error) {
        console.error("Error fetching proveedores:", error);
      }
    };

    if (user) {
      fetchProveedores();
    }
  }, [API_URL, user]);

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Proveedores</h1>
        {proveedores.length === 0 ? (
          <p>No hay proveedores registrados.</p>
        ) : (
          proveedores.map((prov) => (
            <div key={prov._id} className="proveedor-card">
              <h2>{prov.nombre}</h2>
              <p>Dirección: {prov.direccion}</p>
              <p>Emails: {prov.emails.join(", ")}</p>
              <p>Teléfono: {prov.telefono}</p>
              <p>WhatsApp: {prov.whatsapp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProveedoresList;
