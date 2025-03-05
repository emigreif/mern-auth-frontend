// frontend/src/pages/Panol.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext.jsx';

Modal.setAppElement('#root');

const Panol = () => {
  const [panol, setPanol] = useState(null);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Estado para el modal (para agregar nuevos elementos)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'herramienta', 'perfil', 'accesorio', 'vidrio'
  const [itemData, setItemData] = useState({});

  const fetchPanol = async () => {
    try {
      const res = await fetch(`${API_URL}/api/panol`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Error al obtener Panol');
      const data = await res.json();
      setPanol(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPanol();
    }
  }, [API_URL, user]);

  const openModal = (type) => {
    setModalType(type);
    setItemData({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setItemData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = `${API_URL}/api/panol/${modalType}s`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(itemData)
      });
      if (!res.ok) throw new Error('Error al agregar elemento');
      await res.json();
      closeModal();
      fetchPanol();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('¿Está seguro de eliminar este elemento?')) return;
    const endpoint = `${API_URL}/api/panol/${type}s/${id}`;
    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Error al eliminar elemento');
      await res.json();
      fetchPanol();
    } catch (error) {
      console.error(error);
    }
  };

  const generateRemito = async () => {
    try {
      const res = await fetch(`${API_URL}/api/panol/remito`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const generateFichaIngreso = async () => {
    try {
      const res = await fetch(`${API_URL}/api/panol/ingreso`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-container">
        <h1>Pañol</h1>
        {panol ? (
          <>
            <section>
              <h2>Herramientas</h2>
              <button onClick={() => openModal('herramienta')}>Agregar Herramienta</button>
              {panol.herramientas && panol.herramientas.length > 0 ? (
                <ul>
                  {panol.herramientas.map(item => (
                    <li key={item._id}>
                      {item.descripcion} - {item.marca} - {item.modelo} - {item.identificacion} - {item.estado}
                      <button onClick={() => handleDelete('herramienta', item._id)}>Eliminar</button>
                    </li>
                  ))}
                </ul>
              ) : <p>No hay herramientas registradas.</p>}
            </section>

            <section>
              <h2>Perfiles</h2>
              <button onClick={() => openModal('perfil')}>Agregar Perfil</button>
              {panol.perfiles && panol.perfiles.length > 0 ? (
                <ul>
                  {panol.perfiles.map(item => (
                    <li key={item._id}>
                      {item.codigo} - {item.descripcion} - {item.largo} - {item.color} - Cantidad: {item.cantidad}
                      <button onClick={() => handleDelete('perfil', item._id)}>Eliminar</button>
                    </li>
                  ))}
                </ul>
              ) : <p>No hay perfiles registrados.</p>}
            </section>

            <section>
              <h2>Accesorios</h2>
              <button onClick={() => openModal('accesorio')}>Agregar Accesorio</button>
              {panol.accesorios && panol.accesorios.length > 0 ? (
                <ul>
                  {panol.accesorios.map(item => (
                    <li key={item._id}>
                      {item.codigo} - {item.descripcion} - {item.color} - {item.marca} - Cantidad: {item.cantidad}
                      <button onClick={() => handleDelete('accesorio', item._id)}>Eliminar</button>
                    </li>
                  ))}
                </ul>
              ) : <p>No hay accesorios registrados.</p>}
            </section>

            <section>
              <h2>Vidrios</h2>
              <button onClick={() => openModal('vidrio')}>Agregar Vidrio</button>
              {panol.vidrios && panol.vidrios.length > 0 ? (
                <ul>
                  {panol.vidrios.map(item => (
                    <li key={item._id}>
                      {item.codigo} - {item.descripcion} - Cantidad: {item.cantidad} - {item.ancho} x {item.alto}
                      <button onClick={() => handleDelete('vidrio', item._id)}>Eliminar</button>
                    </li>
                  ))}
                </ul>
              ) : <p>No hay vidrios registrados.</p>}
            </section>

            <section>
              <h2>Documentos</h2>
              <button onClick={generateRemito}>Generar Remito de Salida</button>
              <button onClick={generateFichaIngreso}>Generar Ficha de Ingreso</button>
            </section>
          </>
        ) : (
          <p>Cargando datos del pañol...</p>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Elemento"
        style={{ content: { width: '500px', margin: 'auto' } }}
      >
        <h2>Agregar {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h2>
        <form onSubmit={handleSubmit}>
          {modalType === 'herramienta' && (
            <>
              <label>Descripción:</label>
              <input type="text" name="descripcion" value={itemData.descripcion || ''} onChange={handleInputChange} required />
              <label>Marca:</label>
              <input type="text" name="marca" value={itemData.marca || ''} onChange={handleInputChange} required />
              <label>Modelo:</label>
              <input type="text" name="modelo" value={itemData.modelo || ''} onChange={handleInputChange} required />
              <label>Identificación:</label>
              <input type="text" name="identificacion" value={itemData.identificacion || ''} onChange={handleInputChange} required />
              <label>Estado:</label>
              <select name="estado" value={itemData.estado || 'disponible'} onChange={handleInputChange}>
                <option value="disponible">Disponible</option>
                <option value="en uso">En uso</option>
                <option value="en mantenimiento">En mantenimiento</option>
              </select>
            </>
          )}
          {modalType === 'perfil' && (
            <>
              <label>Código:</label>
              <input type="text" name="codigo" value={itemData.codigo || ''} onChange={handleInputChange} required />
              <label>Descripción:</label>
              <input type="text" name="descripcion" value={itemData.descripcion || ''} onChange={handleInputChange} required />
              <label>Largo:</label>
              <input type="text" name="largo" value={itemData.largo || ''} onChange={handleInputChange} required />
              <label>Color:</label>
              <input type="text" name="color" value={itemData.color || ''} onChange={handleInputChange} required />
              <label>Cantidad:</label>
              <input type="number" name="cantidad" value={itemData.cantidad || ''} onChange={handleInputChange} required />
            </>
          )}
          {modalType === 'accesorio' && (
            <>
              <label>Código:</label>
              <input type="text" name="codigo" value={itemData.codigo || ''} onChange={handleInputChange} required />
              <label>Descripción:</label>
              <input type="text" name="descripcion" value={itemData.descripcion || ''} onChange={handleInputChange} required />
              <label>Color:</label>
              <input type="text" name="color" value={itemData.color || ''} onChange={handleInputChange} required />
              <label>Marca:</label>
              <input type="text" name="marca" value={itemData.marca || ''} onChange={handleInputChange} required />
              <label>Cantidad:</label>
              <input type="number" name="cantidad" value={itemData.cantidad || ''} onChange={handleInputChange} required />
            </>
          )}
          {modalType === 'vidrio' && (
            <>
              <label>Código:</label>
              <input type="text" name="codigo" value={itemData.codigo || ''} onChange={handleInputChange} required />
              <label>Descripción:</label>
              <input type="text" name="descripcion" value={itemData.descripcion || ''} onChange={handleInputChange} required />
              <label>Cantidad:</label>
              <input type="number" name="cantidad" value={itemData.cantidad || ''} onChange={handleInputChange} required />
              <label>Ancho:</label>
              <input type="number" name="ancho" step="0.01" value={itemData.ancho || ''} onChange={handleInputChange} required />
              <label>Alto:</label>
              <input type="number" name="alto" step="0.01" value={itemData.alto || ''} onChange={handleInputChange} required />
            </>
          )}
          <div style={{ marginTop: '10px' }}>
            <button type="submit">Guardar</button>
            <button type="button" onClick={closeModal}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Panol;
