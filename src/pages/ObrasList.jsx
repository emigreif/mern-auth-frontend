// frontend/src/pages/ObrasList.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/ObrasList.css';

Modal.setAppElement('#root');

const ObrasList = () => {
  const [obras, setObras] = useState([]);
  const [selectedObra, setSelectedObra] = useState(null);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [modalNuevaObraOpen, setModalNuevaObraOpen] = useState(false);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();

  // Estado para la nueva obra
  const [newObra, setNewObra] = useState({
    referencia: '',
    nombre: '',
    direccion: '',
    contacto: '',
    mapa: '',
    fechaEntrega: '',
    otrosDatos: ''
  });

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

  // Función para asignar color al semáforo según estado (ejemplo)
  const getTrafficLightColor = (status) => {
    switch (status) {
      case 'cumplido':
      case 'aprobado':
        return 'green';
      case 'proximo':
        return 'yellow';
      case 'pendiente':
      default:
        return 'red';
    }
  };

  // Abrir modal de detalles de obra
  const openDetallesModal = (obra) => {
    setSelectedObra(obra);
    setModalDetallesOpen(true);
  };

  const closeDetallesModal = () => {
    setSelectedObra(null);
    setModalDetallesOpen(false);
  };

  // Abrir modal para crear nueva obra
  const openNuevaObraModal = () => {
    setModalNuevaObraOpen(true);
  };

  const closeNuevaObraModal = () => {
    setModalNuevaObraOpen(false);
    // Reiniciar formulario
    setNewObra({
      referencia: '',
      nombre: '',
      direccion: '',
      contacto: '',
      mapa: '',
      fechaEntrega: '',
      otrosDatos: ''
    });
  };

  const handleNewObraChange = (e) => {
    const { name, value } = e.target;
    setNewObra(prev => ({ ...prev, [name]: value }));
  };

  const handleNewObraSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/obras`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newObra)
      });
      if (!res.ok) throw new Error('Error al crear obra');
      const data = await res.json();
      setObras(prev => [...prev, data]);
      closeNuevaObraModal();
    } catch (error) {
      console.error('Error creating obra:', error);
    }
  };

  // Eliminar obra
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta obra?')) {
      try {
        const res = await fetch(`${API_URL}/api/obras/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Error al eliminar obra');
        setObras(prev => prev.filter(o => o._id !== id));
      } catch (error) {
        console.error('Error deleting obra:', error);
      }
    }
  };

  // Función para editar obra (redirige a una página de edición)
  const handleEdit = (id) => {
    navigate(`/obras/${id}/edit`);
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Obras</h1>
        <button onClick={openNuevaObraModal}>Agregar Obra</button>
        {obras.length === 0 ? (
          <p>No hay obras registradas.</p>
        ) : (
          <table className="obras-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Nombre de Obra</th>
                <th>Perfiles</th>
                <th>Accesorios</th>
                <th>Vidrios</th>
                <th>Medición</th>
                <th>Producción</th>
                <th>Fecha de Entrega</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {obras.map(obra => (
                <tr key={obra._id}>
                  <td>{obra.referencia || obra._id}</td>
                  <td>{obra.nombre}</td>
                  <td>
                    <span
                      className="traffic-light"
                      style={{ backgroundColor: getTrafficLightColor(obra.estado?.perfiles) }}
                    ></span>
                  </td>
                  <td>
                    <span
                      className="traffic-light"
                      style={{ backgroundColor: getTrafficLightColor(obra.estado?.accesorios) }}
                    ></span>
                  </td>
                  <td>
                    <span
                      className="traffic-light"
                      style={{ backgroundColor: getTrafficLightColor(obra.estado?.vidrios) }}
                    ></span>
                  </td>
                  <td>
                    <span
                      className="traffic-light"
                      style={{ backgroundColor: getTrafficLightColor(obra.estado?.medicion) }}
                    ></span>
                  </td>
                  <td>
                    <span
                      className="traffic-light"
                      style={{ backgroundColor: getTrafficLightColor(obra.estado?.produccion) }}
                    ></span>
                  </td>
                  <td>{obra.fechaEntrega ? new Date(obra.fechaEntrega).toLocaleDateString() : ''}</td>
                  <td>
                    <button onClick={() => handleEdit(obra._id)}>Editar</button>
                    <button onClick={() => handleDelete(obra._id)}>Eliminar</button>
                    <button onClick={() => openDetallesModal(obra)}>Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para crear nueva obra */}
      <Modal
        isOpen={modalNuevaObraOpen}
        onRequestClose={closeNuevaObraModal}
        contentLabel="Agregar Nueva Obra"
        style={{ content: { width: '600px', margin: 'auto' } }}
      >
        <h2>Agregar Nueva Obra</h2>
        <form onSubmit={handleNewObraSubmit}>
          <div>
            <label>Referencia:</label>
            <input
              type="text"
              name="referencia"
              value={newObra.referencia}
              onChange={handleNewObraChange}
              required
            />
          </div>
          <div>
            <label>Nombre de la Obra:</label>
            <input
              type="text"
              name="nombre"
              value={newObra.nombre}
              onChange={handleNewObraChange}
              required
            />
          </div>
          <div>
            <label>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={newObra.direccion}
              onChange={handleNewObraChange}
              required
            />
          </div>
          <div>
            <label>Contacto:</label>
            <input
              type="text"
              name="contacto"
              value={newObra.contacto}
              onChange={handleNewObraChange}
            />
          </div>
          <div>
            <label>Mapa:</label>
            <input
              type="text"
              name="mapa"
              value={newObra.mapa}
              onChange={handleNewObraChange}
            />
          </div>
          <div>
            <label>Fecha de Entrega:</label>
            <input
              type="date"
              name="fechaEntrega"
              value={newObra.fechaEntrega}
              onChange={handleNewObraChange}
              required
            />
          </div>
          <div>
            <label>Otros Datos:</label>
            <textarea
              name="otrosDatos"
              value={newObra.otrosDatos}
              onChange={handleNewObraChange}
            ></textarea>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button type="submit">Guardar Obra</button>
            <button type="button" onClick={closeNuevaObraModal}>Cancelar</button>
          </div>
        </form>
      </Modal>

      {/* Modal para ver detalles completos de la obra */}
      <Modal
        isOpen={modalDetallesOpen}
        onRequestClose={closeDetallesModal}
        contentLabel="Detalles de Obra"
        style={{ content: { width: '600px', margin: 'auto' } }}
      >
        {selectedObra && (
          <div className="obra-details">
            <h2>Detalles de Obra</h2>
            <p><strong>Referencia:</strong> {selectedObra.referencia || selectedObra._id}</p>
            <p><strong>Nombre:</strong> {selectedObra.nombre}</p>
            <p><strong>Dirección:</strong> {selectedObra.direccion}</p>
            <p><strong>Contacto:</strong> {selectedObra.contacto}</p>
            <p><strong>Mapa:</strong> {selectedObra.mapa}</p>
            <p><strong>Fecha de Entrega:</strong> {selectedObra.fechaEntrega ? new Date(selectedObra.fechaEntrega).toLocaleDateString() : ''}</p>
            <p><strong>Otros Datos:</strong> {selectedObra.otrosDatos}</p>
            {/* Se pueden incluir otros campos calculados */}
          </div>
        )}
        <button onClick={closeDetallesModal}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default ObrasList;