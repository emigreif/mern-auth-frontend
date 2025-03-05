// frontend/src/pages/PresupuestosList.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// Configuramos el elemento raíz para el modal
Modal.setAppElement('#root');

const PresupuestosList = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();

  // Estado para el modal de edición
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState(null);

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/presupuestos`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener presupuestos');
        const data = await res.json();
        setPresupuestos(data);
      } catch (error) {
        console.error('Error fetching presupuestos:', error);
      }
    };

    if (user) {
      fetchPresupuestos();
    }
  }, [API_URL, user]);

  // Abre el modal para editar un presupuesto
  const openEditModal = (presupuesto) => {
    setSelectedPresupuesto(presupuesto);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPresupuesto(null);
  };

  // Manejo de cambios en el formulario del modal
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedPresupuesto(prev => ({ ...prev, [name]: value }));
  };

  // Guardar cambios en el presupuesto editado
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/presupuestos/${selectedPresupuesto._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(selectedPresupuesto)
      });
      if (!res.ok) throw new Error('Error al actualizar presupuesto');
      const updated = await res.json();
      setPresupuestos(prev =>
        prev.map(p => (p._id === updated._id ? updated : p))
      );
      closeModal();
    } catch (error) {
      console.error('Error updating presupuesto:', error);
    }
  };

  // Función para convertir presupuesto a obra
  const handleConvertToObra = (presupuesto) => {
    if (presupuesto.estado === 'aprobado') {
      // Navega a la pantalla de carga de nueva obra, pasando los datos comunes del presupuesto
      navigate('/nueva-obra', { state: { presupuesto } });
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Presupuestos</h1>
        {presupuestos.length === 0 ? (
          <p>No hay presupuestos registrados.</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0" width="100%">
            <thead>
              <tr>
                <th>ID Obra</th>
                <th>Nombre de la Obra</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {presupuestos.map(p => (
                <tr key={p._id}>
                  <td>{p.idObra ? p.idObra : p._id}</td>
                  <td>{p.nombreObra}</td>
                  <td>{p.cliente}</td>
                  <td>{p.estado}</td>
                  <td>
                    {/* Botón de conversión a obra: activo solo si el estado es "aprobado" */}
                    <button
                      onClick={() => handleConvertToObra(p)}
                      disabled={p.estado !== 'aprobado'}
                      title={p.estado === 'aprobado' ? 'Convertir a Obra' : 'Presupuesto no aprobado'}
                    >
                      🔄
                    </button>
                    {/* Botón para editar presupuesto */}
                    <button onClick={() => openEditModal(p)} title="Editar Presupuesto">✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para editar presupuesto */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Presupuesto"
        style={{ content: { width: '500px', margin: 'auto' } }}
      >
        {selectedPresupuesto && (
          <form onSubmit={handleUpdate}>
            <h2>Editar Presupuesto</h2>
            <div>
              <label>Nombre de la Obra:</label>
              <input
                type="text"
                name="nombreObra"
                value={selectedPresupuesto.nombreObra}
                onChange={handleModalChange}
                required
              />
            </div>
            <div>
              <label>Cliente:</label>
              <input
                type="text"
                name="cliente"
                value={selectedPresupuesto.cliente}
                onChange={handleModalChange}
                required
              />
            </div>
            <div>
              <label>Estado:</label>
              <select
                name="estado"
                value={selectedPresupuesto.estado}
                onChange={handleModalChange}
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="perdido">Perdido</option>
              </select>
            </div>
            {selectedPresupuesto.estado === 'perdido' && (
              <div>
                <label>Empresa Contra la que se Perdió:</label>
                <input
                  type="text"
                  name="empresaPerdida"
                  value={selectedPresupuesto.empresaPerdida || ''}
                  onChange={handleModalChange}
                />
              </div>
            )}
            <div style={{ marginTop: '10px' }}>
              <button type="submit">Guardar Cambios</button>
              <button type="button" onClick={closeModal}>Cancelar</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PresupuestosList;
