// src/pages/Clientes.jsx
import React, { useState, useEffect } from "react";
import styles from "../styles/pages/GlobalStylePages.module.css";
import { useAuth } from "../context/AuthContext.jsx";
import ModalNuevoCliente from "../components/modals/modalNuevoCliente.jsx";
import Button from "../components/ui/Button.jsx";

const Clientes = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { token } = useAuth();
  
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (token) fetchClientes();
  }, [token]);
  
  const fetchClientes = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const dataErr = await res.json();
        throw new Error(dataErr.message || "Error al obtener clientes");
      }
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = (reload = false) => {
    setIsModalOpen(false);
    if (reload) fetchClientes();
  };
  
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Clientes</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Agregar Cliente</Button>
      </div>
      
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <div className={styles.spinner}>Cargando clientes...</div>}
      {!loading && clientes.length === 0 && !errorMsg && (
        <div className={styles.noData}>No hay clientes para mostrar</div>
      )}
      
      {!loading && clientes.length > 0 && (
        <div className={styles.list}>
          {clientes.map((c) => (
            <div key={c._id} className={styles.listItem}>
              <h2>{c.nombre} {c.apellido}</h2>
              <p><strong>Email:</strong> {c.email}</p>
              <p><strong>Teléfono:</strong> {c.telefono}</p>
              <p>
                <strong>Dirección:</strong>{" "}
                {c.direccion?.calle}, {c.direccion?.ciudad}
              </p>
              <p>
                <strong>Cond. Fiscal:</strong> {c.condicionFiscal}
              </p>
              {c.condicionFiscal === "responsableInscripto" && (
                <>
                  <p><strong>Razón Social:</strong> {c.razonSocial}</p>
                  <p><strong>CUIT:</strong> {c.cuit}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isModalOpen && (
        <ModalNuevoCliente
          onCreated={() => handleCloseModal(true)}
          onClose={() => handleCloseModal(false)}
        />
      )}
    </div>
  );
};

export default Clientes;
