// src/pages/Nomina.jsx
import React, { useEffect, useState } from "react";
import ModalBase from "../components/ModalBase.jsx";

const Nomina = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [empleados, setEmpleados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    puesto: "",
    salario: 0,
  });

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const res = await fetch(`${API_URL}/api/employee`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener empleados");
        const data = await res.json();
        setEmpleados(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmpleados();
  }, [API_URL]);

  const handleInputChange = (e) => {
    setNuevoEmpleado({ ...nuevoEmpleado, [e.target.name]: e.target.value });
  };

  const handleCreateEmpleado = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/employee`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEmpleado),
      });
      if (!res.ok) throw new Error("Error al crear empleado");
      const data = await res.json();
      setEmpleados([...empleados, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
      <div className="page-contenedor">
        <h1>Nómina</h1>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Agregar Empleado
        </button>

        <div className="list">
          {empleados.map((emp) => (
            <div key={emp._id} className="list-item">
              <h2>
                {emp.nombre} {emp.apellido}
              </h2>
              <p>
                <strong>DNI:</strong> {emp.dni}
              </p>
              <p>
                <strong>Email:</strong> {emp.email}
              </p>
              <p>
                <strong>Puesto:</strong> {emp.puesto}
              </p>
              <p>
                <strong>Salario:</strong> {emp.salario}
              </p>
            </div>
          ))}
        </div>

        <ModalBase
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Empleado"
        >
          <form onSubmit={handleCreateEmpleado}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>DNI</label>
              <input
                type="text"
                name="dni"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Puesto</label>
              <input type="text" name="puesto" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Salario</label>
              <input
                type="number"
                name="salario"
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

export default Nomina;
