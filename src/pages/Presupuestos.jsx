// frontend/src/pages/PresupuestosList.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext.jsx';

Modal.setAppElement('#root');

const PresupuestosList = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Estado para el modal de agregar presupuesto
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPresupuesto, setNewPresupuesto] = useState({
    nombreObra: '',
    cliente: '',
    estado: 'pendiente',
    direccion: '',
    totalPresupuestado: '',
    totalConFactura: '',
    totalSinFactura: '',
    indiceCAC: '',
    fechaEntrega: '',
    descripcion: '',
    empresaPerdida: ''
  });

  // Cargar presupuestos
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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPresupuesto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convertir valores numéricos según corresponda
    const payload = {
      ...newPresupuesto,
      totalPresupuestado: Number(newPresupuesto.totalPresupuestado),
      totalConFactura: Number(newPresupuesto.totalConFactura),
      totalSinFactura: Number(newPresupuesto.totalSinFactura)
    };

    try {
      const res = await fetch(`${API_URL}/api/presupuestos`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al crear presupuesto');
      const data = await res.json();
      setPresupuestos((prev) => [...prev, data]);
      closeModal();
      // Reiniciar el formulario
      setNewPresupuesto({
        nombreObra: '',
        cliente: '',
        estado: 'pendiente',
        direccion: '',
        totalPresupuestado: '',
        totalConFactura: '',
        totalSinFactura: '',
        indiceCAC: '',
        fechaEntrega: '',
        descripcion: '',
        empresaPerdida: ''
      });
    } catch (error) {
      console.error('Error creating presupuesto:', error);
    }
  };

  // Función para eliminar presupuesto (opcional)
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este presupuesto?')) {
      try {
        const res = await fetch(`${API_URL}/api/presupuestos/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Error al eliminar presupuesto');
        setPresupuestos((prev) => prev.filter((p) => p._id !== id));
      } catch (error) {
        console.error('Error deleting presupuesto:', error);
      }
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
        <h1>Presupuestos</h1>
        <button onClick={openModal}>Agregar Presupuesto</button>
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
              {presupuestos.map((p) => (
                <tr key={p._id}>
                  <td>{p.idObra ? p.idObra : p._id}</td>
                  <td>{p.nombreObra}</td>
                  <td>{p.cliente}</td>
                  <td>{p.estado}</td>
                  <td>
                    <button onClick={() => handleDelete(p._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Presupuesto"
        style={{ content: { width: '600px', margin: 'auto' } }}
      >
        <h2>Agregar Nuevo Presupuesto</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre de la Obra:</label>
            <input
              type="text"
              name="nombreObra"
              value={newPresupuesto.nombreObra}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Cliente:</label>
            <input
              type="text"
              name="cliente"
              value={newPresupuesto.cliente}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Estado:</label>
            <select
              name="estado"
              value={newPresupuesto.estado}
              onChange={handleInputChange}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="perdido">Perdido</option>
            </select>
          </div>
          {newPresupuesto.estado === 'perdido' && (
            <div>
              <label>Empresa Contra la que se Perdió:</label>
              <input
                type="text"
                name="empresaPerdida"
                value={newPresupuesto.empresaPerdida}
                onChange={handleInputChange}
              />
            </div>
          )}
          <div>
            <label>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={newPresupuesto.direccion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Total Presupuestado:</label>
            <input
              type="number"
              name="totalPresupuestado"
              value={newPresupuesto.totalPresupuestado}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Total Con Factura:</label>
            <input
              type="number"
              name="totalConFactura"
              value={newPresupuesto.totalConFactura}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Total Sin Factura:</label>
            <input
              type="number"
              name="totalSinFactura"
              value={newPresupuesto.totalSinFactura}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Índice CAC:</label>
            <input
              type="text"
              name="indiceCAC"
              value={newPresupuesto.indiceCAC}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Fecha de Entrega:</label>
            <input
              type="date"
              name="fechaEntrega"
              value={newPresupuesto.fechaEntrega}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Descripción:</label>
            <textarea
              name="descripcion"
              value={newPresupuesto.descripcion}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button type="submit">Guardar Presupuesto</button>
            <button type="button" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PresupuestosList;
