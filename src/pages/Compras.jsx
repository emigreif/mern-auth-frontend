// frontend/src/pages/Compras.jsx
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useAuth } from "../context/AuthContext.jsx";

const Compras = () => {
  const [compras, setCompras] = useState([]);
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

    const fetchCompras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/compras`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener compras");
        const data = await res.json();
        setCompras(data);
      } catch (error) {
        console.error("Error fetching compras:", error);
      }
    };

    if (user) {
      fetchProveedores();
      fetchCompras();
    }
  }, [API_URL, user]);

  // Funciones para agregar compra y cargar archivo se mantienen similares
  // pero en la función guardarCompras se debe enviar la data al backend.
  const guardarCompras = async () => {
    if (compras.length === 0) {
      alert("No hay compras para guardar.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/compras`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(compras),
      });
      if (!response.ok) throw new Error("Error al guardar las compras");
      alert("Compras guardadas con éxito");
    } catch (error) {
      console.error("Error guardando compras:", error);
    }
  };

  return (
    <div className="page-contenedor">
      <h1>Compras</h1>
      {/* Resto de la lógica (tabla, modal, etc.) se mantiene similar */}
      <button onClick={guardarCompras}>Guardar Compras</button>
    </div>
  );
};

export default Compras;
