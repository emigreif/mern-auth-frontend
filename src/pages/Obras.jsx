import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "../components/ModalBase.jsx";
import TableBase from "../components/TableBase.jsx";
import "../styles/Obras.css";

const Obras = () => {
  const [obras, setObras] = useState([]);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
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
        <TableBase
          headers={["ID", "Nombre", "Cliente", "Estado"]}
          data={obras.map((obra) => ({
            ID: obra.id,
            Nombre: obra.nombre,
            Cliente: obra.cliente,
            Estado: obra.estado,
          }))}
          onRowClick={(obra) => setObraSeleccionada(obra)}
        />

        {/* Modal de detalle de obra */}
        <ModalBase isOpen={!!obraSeleccionada} onClose={() => setObraSeleccionada(null)}>
          {obraSeleccionada && (
            <>
              <h2>Detalle de Obra</h2>
              <p><strong>ID:</strong> {obraSeleccionada.id}</p>
              <p><strong>Nombre:</strong> {obraSeleccionada.nombre}</p>
              <p><strong>Cliente:</strong> {obraSeleccionada.cliente}</p>
              <p><strong>Estado:</strong> {obraSeleccionada.estado}</p>
            </>
          )}
        </ModalBase>
      </div>
    </div>
  );
};

export default Obras;
