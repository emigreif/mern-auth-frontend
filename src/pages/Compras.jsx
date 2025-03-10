// src/pages/Compras.jsx
import React, { useState, useEffect } from "react";
import ModalBase from "../components/ModalBase.jsx";

const Compras = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [compras, setCompras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nuevaCompra, setNuevaCompra] = useState({
    proveedor: "",
    obra: "",
    tipo: "aluminio", // Ejemplo
    cantidad: 0,
  });

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/compras`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener compras");
        const data = await res.json();
        setCompras(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompras();
  }, [API_URL]);

  const handleInputChange = (e) => {
    setNuevaCompra({ ...nuevaCompra, [e.target.name]: e.target.value });
  };

  const handleCreateCompra = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/compras`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCompra),
      });
      if (!res.ok) throw new Error("Error al crear compra");
      const data = await res.json();
      setCompras([...compras, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
      <div className="page-contenedor">
        <h1>Compras</h1>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Agregar Compra
        </button>

        <div className="list">
          {compras.map((c) => (
            <div key={c._id} className="list-item">
              <h3>
                {c.tipo} - Proveedor: {c.proveedor}
              </h3>
              <p>
                <strong>Obra:</strong> {c.obra}
              </p>
              <p>
                <strong>Cantidad:</strong> {c.cantidad}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(c.fechaCompra).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Compra"
        >
          <form onSubmit={handleCreateCompra}>
            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" onChange={handleInputChange}>
                <option value="aluminio">Aluminio</option>
                <option value="vidrios">Vidrios</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>
            <div className="form-group">
              <label>Proveedor</label>
              <input
                type="text"
                name="proveedor"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Obra</label>
              <input type="text" name="obra" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn">
                Guardar
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </ModalBase>
      </div>
    
  );
};

export default Compras;
