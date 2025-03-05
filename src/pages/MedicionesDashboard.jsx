// frontend/src/pages/MedicionesDashboard.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const MedicionesDashboard = () => {
  const [obras, setObras] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();

  // Estado para el modal (para cada uno de los 3 procesos)
  const [modalCarga, setModalCarga] = useState({ open: false, type: null, obra: null });

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener obras');
        const data = await res.json();
        setObras(data);
      } catch (error) {
        console.error('Error fetching obras:', error);
      }
    };

    if (user) {
      fetchObras();
    }
  }, [API_URL, user]);

  const openModal = (type, obra) => {
    setModalCarga({ open: true, type, obra });
  };

  const closeModal = () => {
    setModalCarga({ open: false, type: null, obra: null });
  };

  const renderModalContent = () => {
    if (!modalCarga.obra) return null;
    if (modalCarga.type === 'ubicaciones') {
      return (
        <div>
          <h2>Carga de Ubicaciones para {modalCarga.obra.nombre}</h2>
          <form onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
            <label>Pisos (puede ser una lista o rango):</label>
            <input type="text" placeholder="Ej. 1,2,3 o 1-5" required />
            <label>Cantidad de ubicaciones por piso:</label>
            <input type="number" required />
            <button type="submit">Guardar Ubicaciones</button>
          </form>
        </div>
      );
    } else if (modalCarga.type === 'tipologias') {
      return (
        <div>
          <h2>Carga de Tipologías para {modalCarga.obra.nombre}</h2>
          <form onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
            <label>Identificador:</label>
            <input type="text" required />
            <label>Descripción:</label>
            <input type="text" required />
            <label>Cantidad:</label>
            <input type="number" required />
            <label>Ancho:</label>
            <input type="number" step="0.01" required />
            <label>Alto:</label>
            <input type="number" step="0.01" required />
            <button type="submit">Guardar Tipología</button>
          </form>
          <button onClick={() => {/* lógica de importación Excel */}}>Importar desde Excel</button>
        </div>
      );
    } else if (modalCarga.type === 'asociacion') {
      return (
        <div>
          <h2>Asociar Tipologías a Ubicaciones para {modalCarga.obra.nombre}</h2>
          <form onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
            <label>Ubicación (Piso y número):</label>
            <input type="text" required />
            <label>ID(s) de Tipología (separados por coma):</label>
            <input type="text" required />
            <button type="submit">Asociar</button>
          </form>
        </div>
      );
    }
    return null;
  };

  // El botón de Mediciones redirige a una página de mediciones para la obra
  const handleMediciones = (obra) => {
    navigate('/mediciones', { state: { obra } });
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Mediciones</h1>
        <table border="1" cellPadding="8" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Referencia</th>
              <th>Nombre de Obra</th>
              <th>Ubicaciones</th>
              <th>Tipologías</th>
              <th>Mediciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obras.map(obra => (
              <tr key={obra._id}>
                <td>{obra._id}</td>
                <td>{obra.nombre}</td>
                <td style={{ color: obra.ubicacionesLoaded ? 'green' : 'red' }}>
                  {obra.ubicacionesLoaded ? 'Cargadas' : 'Pendiente'}
                </td>
                <td style={{ color: obra.tipologiasLoaded ? 'green' : 'red' }}>
                  {obra.tipologiasLoaded ? 'Cargadas' : 'Pendiente'}
                </td>
                <td style={{ color: obra.medicionesLoaded ? 'green' : 'red' }}>
                  {obra.medicionesLoaded ? 'Completas' : 'Pendiente'}
                </td>
                <td>
                  <button onClick={() => openModal('ubicaciones', obra)}>Carga Ubicaciones</button>
                  <button onClick={() => openModal('tipologias', obra)}>Carga Tipologías</button>
                  <button onClick={() => openModal('asociacion', obra)}>Asociar</button>
                  <button onClick={() => handleMediciones(obra)}>Mediciones</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalCarga.open}
        onRequestClose={closeModal}
        contentLabel="Carga Modal"
        style={{ content: { width: '600px', margin: 'auto' } }}
      >
        {renderModalContent()}
        <button onClick={closeModal}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default MedicionesDashboard;
