// src/pages/Nomina.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Nomina.module.css";

// Ejemplo: un modal + un componente para crear empleado
import ModalBase from "../../components/ModalBase/ModalBase.jsx";
import NuevoEmpleado from "../../components/NuevoEmpleado/NuevoEmpleado.jsx";

/**
 * Página "Nómina"
 * - GET /api/employee => lista de empleados
 * - POST /api/employee => crear nuevo empleado
 * - Muestra spinner, error, no data
 */
const Nomina = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { token } = useAuth();

  const [empleados, setEmpleados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchEmpleados();
  }, [API_URL, token]);

  const fetchEmpleados = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/employee`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
    if (reload) {
      fetchEmpleados();
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Nómina</h1>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          Agregar Empleado
        </button>
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
                <strong>Teléfono:</strong> {emp.telefono}
              </p>
              <p>
                <strong>Dirección:</strong> {emp.direccion}
              </p>
              <p>
                <strong>Puesto:</strong> {emp.puesto}
              </p>
              <p>
                <strong>Salario:</strong> {emp.salario}
              </p>
              <p>
                <strong>Activo:</strong> {emp.activo ? "Sí" : "No"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear empleado */}
      {isModalOpen && (
        <ModalBase
          isOpen={isModalOpen}
          onClose={() => handleCloseModal(false)}
          title="Agregar Empleado"
        >
          <NuevoEmpleado
            onCreated={() => handleCloseModal(true)}
            onClose={() => handleCloseModal(false)}
          />
        </ModalBase>
      )}
    </div>
  );
};

export default Nomina;
