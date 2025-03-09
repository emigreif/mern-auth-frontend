import React, { useState, useEffect } from "react";
import TableBase from "../components/TableBase.jsx";
import ModalBase from "../components/ModalBase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/Reportes.css";

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoReporte, setNuevoReporte] = useState({ categoria: "", descripcion: "", fecha: "" });
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/reportes`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setReportes(data))
        .catch((error) => console.error("Error fetching reportes:", error));
    }
  }, [API_URL, user]);

  const handleInputChange = (e) => {
    setNuevoReporte({ ...nuevoReporte, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReportes([...reportes, nuevoReporte]);
    setIsModalOpen(false);
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Reportes</h1>
        <button onClick={() => setIsModalOpen(true)}>Agregar Reporte</button>

        <TableBase
          headers={["Categoría", "Descripción", "Fecha"]}
          data={reportes.map((r) => ({
            Categoría: r.categoria,
            Descripción: r.descripcion,
            Fecha: r.fecha,
          }))}
        />

        <ModalBase isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Agregar Reporte</h2>
          <form onSubmit={handleSubmit}>
            <label>Categoría:</label>
            <input type="text" name="categoria" value={nuevoReporte.categoria} onChange={handleInputChange} required />
            <label>Descripción:</label>
            <textarea name="descripcion" value={nuevoReporte.descripcion} onChange={handleInputChange} required />
            <label>Fecha:</label>
            <input type="date" name="fecha" value={nuevoReporte.fecha} onChange={handleInputChange} required />
            <button type="submit">Guardar</button>
          </form>
        </ModalBase>
      </div>
    </div>
  );
};

export default Reportes;
