import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalBase from "../components/ModalBase.jsx";

const Nomina = () => {
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "https://mern-auth-backend.onrender.com";

  const [employeeData, setEmployeeData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    direccion: "",
    puesto: "",
    salario: "",
    fechaIngreso: "",
    activo: true,
  });

  // 📌 Cargar empleados desde el backend
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const res = await fetch(`${API_URL}/api/empleados`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Error al obtener empleados");
        const data = await res.json();
        setEmpleados(data);
      } catch (error) {
        console.error("Error fetching empleados:", error);
      }
    };

    if (user) fetchEmpleados();
  }, [API_URL, user]);

  // 📌 Filtrar empleados por nombre o puesto
  const filteredEmpleados = empleados.filter(
    (emp) =>
      emp.nombre.toLowerCase().includes(search.toLowerCase()) ||
      emp.apellido.toLowerCase().includes(search.toLowerCase()) ||
      emp.puesto.toLowerCase().includes(search.toLowerCase())
  );

  // 📌 Manejo del modal
  const openModal = (empleado = null) => {
    setEditingEmployee(empleado);
    setEmployeeData(
      empleado || {
        nombre: "",
        apellido: "",
        dni: "",
        email: "",
        telefono: "",
        direccion: "",
        puesto: "",
        salario: "",
        fechaIngreso: "",
        activo: true,
      }
    );
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // 📌 Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 Guardar o Editar Empleado
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingEmployee ? "PUT" : "POST";
    const url = editingEmployee ? `${API_URL}/api/empleados/${editingEmployee._id}` : `${API_URL}/api/empleados`;

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(employeeData),
      });

      if (!res.ok) throw new Error("Error al guardar empleado");

      const data = await res.json();
      setEmpleados(editingEmployee ? empleados.map((e) => (e._id === data._id ? data : e)) : [...empleados, data]);
      closeModal();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  // 📌 Eliminar Empleado
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este empleado?")) return;

    try {
      await fetch(`${API_URL}/api/empleados/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setEmpleados(empleados.filter((e) => e._id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Nómina del Personal</h1>

        {/* 🔍 Barra de búsqueda */}
        <input type="text" placeholder="Buscar empleado..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-bar" />

        {/* ➕ Botón para agregar empleado */}
        <button onClick={() => openModal()} className="add-button">Agregar Empleado</button>

        {/* 📋 Lista de empleados */}
        {filteredEmpleados.length === 0 ? (
          <p>No hay empleados registrados.</p>
        ) : (
          <div className="empleados-list">
            {filteredEmpleados.map((emp) => (
              <div key={emp._id} className="empleado-card">
                <h2>{emp.nombre} {emp.apellido}</h2>
                <p><strong>Puesto:</strong> {emp.puesto}</p>
                <p><strong>Salario:</strong> ${emp.salario}</p>
                <p><strong>Estado:</strong> {emp.activo ? "Activo" : "Inactivo"}</p>
                <div className="action-buttons">
                  <button onClick={() => openModal(emp)}>✏️ Editar</button>
                  <button onClick={() => handleDelete(emp._id)}>❌ Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🏗️ Modal para agregar/editar empleado */}
      <ModalBase isOpen={isModalOpen} onClose={closeModal} title={editingEmployee ? "Editar Empleado" : "Agregar Empleado"}>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={employeeData.nombre} onChange={handleInputChange} required />
          
          <label>Apellido:</label>
          <input type="text" name="apellido" value={employeeData.apellido} onChange={handleInputChange} required />

          <label>Puesto:</label>
          <input type="text" name="puesto" value={employeeData.puesto} onChange={handleInputChange} required />

          <label>Salario:</label>
          <input type="number" name="salario" value={employeeData.salario} onChange={handleInputChange} required />

          <button type="submit">Guardar</button>
        </form>
      </ModalBase>
    </div>
  );
};

export default Nomina;
