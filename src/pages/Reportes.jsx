import React, { useState } from "react";
import "../styles/Reportes.css";

const Reportes = () => {
  const [reportes, setReportes] = useState([
    { id: 1, categoria: "Obras", descripcion: "Balance de costos vs ingresos", fecha: "2024-06-10" },
    { id: 2, categoria: "Producción", descripcion: "Tiempos de fabricación por obra", fecha: "2024-06-12" },
    { id: 3, categoria: "Stock", descripcion: "Consumos de insumos y reposiciones", fecha: "2024-06-15" },
    { id: 4, categoria: "Pagos", descripcion: "Estado de cuentas de clientes y proveedores", fecha: "2024-06-20" }
  ]);

  return (
    <div className="reportes-background">
      <div className="reportes-container">
        <h1>Reportes</h1>
        <div className="reportes-list">
          {reportes.map((reporte) => (
            <div key={reporte.id} className="reporte-card">
              <span className="fecha">{reporte.fecha}</span>
              <span className="categoria">{reporte.categoria}</span>
              <span className="descripcion">{reporte.descripcion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reportes;
