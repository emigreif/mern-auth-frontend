// src/pages/Nomina.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ModalNuevoEmpleado from "../components/modals/ModalNuevoEmpleado.jsx";
import ModalBase from "../components/modals/ModalBase.jsx";
import Button from "../components/ui/Button.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";

const Nomina = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { token } = useAuth();

  const [empleados, setEmpleados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) fetchEmpleados();
  }, [token]);

  const fetchEmpleados = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/employee`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al obtener empleados");
      }
      const data = await res.json();
      setEmpleados(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = (reload = false) => {
    setIsModalOpen(false);
    if (reload) fetchEmpleados();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Nómina</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          ➕ Agregar Empleado
        </Button>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando empleados...</div>}
      {!loading && empleados.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay empleados para mostrar</div>
      )}
      {!loading && empleados.length > 0 && (
        <div className={styles.list}>
          {empleados.map((emp) => (
            <div key={emp._id} className={styles.listItem}>
              <h2>{emp.nombre} {emp.apellido}</h2>
              <p><strong>DNI:</strong> {emp.dni}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Teléfono:</strong> {emp.telefono}</p>
              <p><strong>Dirección:</strong> {emp.direccion}</p>
              <p><strong>Puesto:</strong> {emp.puesto}</p>
              <p><strong>Salario:</strong> {emp.salario}</p>
              <p><strong>Activo:</strong> {emp.activo ? "Sí" : "No"}</p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ModalBase isOpen={isModalOpen} onClose={() => handleCloseModal(false)} title="Agregar Empleado">
          <ModalNuevoEmpleado onCreated={() => handleCloseModal(true)} onClose={() => handleCloseModal(false)} />
        </ModalBase>
      )}
    </div>
  );
};

export default Nomina;
