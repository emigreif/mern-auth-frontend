import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

// Configurar el elemento raíz para el modal
Modal.setAppElement('#root');

const ComprasPage = () => {
  const [tipo, setTipo] = useState('perfiles'); // 'perfiles', 'vidrios' o 'accesorios'
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para el modal de nueva orden
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);
  const [newOrderData, setNewOrderData] = useState({
    proveedor: '',
    fechaPedido: new Date().toISOString().slice(0,10),
    lugarEntrega: '',
    detalles: [] // será asignado a 'pedido', 'vidrios' o 'accesorios' según el tipo
  });

  // Cargar las compras del tipo seleccionado
  useEffect(() => {
    const fetchCompras = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/compras/${tipo}`);
        setCompras(res.data);
      } catch (err) {
        setError('Error al obtener las compras');
        console.error(err);
      }
      setLoading(false);
    };
    fetchCompras();
  }, [tipo]);

  // Función para calcular la cantidad total de materiales pedidos
  const computeTotalCantidad = (compra) => {
    let total = 0;
    if (tipo === 'perfiles') {
      total = compra.pedido?.reduce((acc, item) => acc + item.cantidad, 0) || 0;
    } else if (tipo === 'vidrios') {
      total = compra.vidrios?.reduce((acc, item) => acc + item.cantidad, 0) || 0;
    } else if (tipo === 'accesorios') {
      total = compra.accesorios?.reduce((acc, item) => acc + item.cantidad, 0) || 0;
    }
    return total;
  };

  // Función para calcular el status de la orden según la cantidad recibida vs. la pedida
  const computeStatus = (compra) => {
    let totalPedido = 0;
    let totalRecibido = 0;
    if (tipo === 'perfiles') {
      compra.pedido?.forEach(item => {
        totalPedido += item.cantidad;
        totalRecibido += item.cantidadIngresada || 0;
      });
    } else if (tipo === 'vidrios') {
      compra.vidrios?.forEach(item => {
        totalPedido += item.cantidad;
        totalRecibido += item.cantidadIngresada || 0;
      });
    } else if (tipo === 'accesorios') {
      compra.accesorios?.forEach(item => {
        totalPedido += item.cantidad;
        totalRecibido += item.cantidadIngresada || 0;
      });
    }
    if (totalRecibido === 0) return 'Pendiente';
    if (totalRecibido >= totalPedido) return 'Completo';
    return 'Parcial';
  };

  // Función para eliminar una compra con confirmación
  const deleteCompra = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este pedido?")) {
      try {
        await axios.delete(`/api/compras/${tipo}/${id}`);
        setCompras(compras.filter(compra => compra._id !== id));
      } catch (err) {
        console.error("Error al eliminar la compra", err);
      }
    }
  };

  // Abrir modal para nueva orden según el tipo
  const openModalForType = (orderType) => {
    setModalTipo(orderType);
    // Reiniciar datos del formulario
    setNewOrderData({
      proveedor: '',
      fechaPedido: new Date().toISOString().slice(0,10),
      lugarEntrega: '',
      detalles: []
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Agregar manualmente un detalle a la orden
  const addDetailRow = () => {
    setNewOrderData({
      ...newOrderData,
      detalles: [...newOrderData.detalles, { codigo: '', descripcion: '', cantidad: 0 }]
    });
  };

  // Función para manejar la importación desde Excel (placeholder)
  const handleExcelImport = (e) => {
    // Aquí se implementaría la lógica para parsear el archivo Excel y actualizar newOrderData.detalles
    console.log("Importar desde Excel");
  };

  // Función para importar orden desde presupuesto (placeholder)
  const handleImportFromPresupuesto = () => {
    // Aquí se haría una llamada para obtener el listado de items del presupuesto asociado a la obra
    console.log("Importar desde Presupuesto");
  };

  // Guardar la nueva orden de compra
  const saveNewOrder = async () => {
    try {
      // Preparar el payload según el tipo (asignar newOrderData.detalles al campo correspondiente)
      let payload = { ...newOrderData };
      if(modalTipo === 'perfiles') {
        payload = { ...newOrderData, pedido: newOrderData.detalles };
      } else if (modalTipo === 'vidrios') {
        payload = { ...newOrderData, vidrios: newOrderData.detalles };
      } else if (modalTipo === 'accesorios') {
        payload = { ...newOrderData, accesorios: newOrderData.detalles };
      }
      const res = await axios.post(`/api/compras/${modalTipo}`, payload);
      // Actualizar la lista con la nueva orden
      setCompras([...compras, res.data]);
      closeModal();
    } catch (err) {
      console.error("Error al guardar la orden de compra", err);
    }
  };

  return (
    <div className="page-background">
      <div className="page-contenedor">
      <h1>Órdenes de Compra</h1>
      {/* Botones para crear nueva orden */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => openModalForType('perfiles')}>Compra Perfiles</button>
        <button onClick={() => openModalForType('vidrios')}>Compra Vidrios</button>
        <button onClick={() => openModalForType('accesorios')}>Compra Accesorios</button>
      </div>

      {/* Tabla de compras */}
      {loading ? (
        <p>Cargando órdenes...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Nº Orden</th>
              <th>Tipo</th>
              <th>Cantidad Total</th>
              <th>Fecha de Pedido</th>
              <th>Proveedor</th>
              <th>Lugar de Entrega</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.map(compra => (
              <tr key={compra._id}>
                <td>{compra.numeroPedido}</td>
                <td>
                  {tipo === 'perfiles'
                    ? 'Perfiles'
                    : tipo === 'vidrios'
                    ? 'Vidrios'
                    : 'Accesorios'}
                </td>
                <td>{computeTotalCantidad(compra)}</td>
                <td>{new Date(compra.fechaCompra).toLocaleDateString()}</td>
                <td>{compra.proveedor?.nombre || 'N/A'}</td>
                <td>{compra.lugarEntrega || compra.direccionEntrega || 'N/A'}</td>
                <td>{computeStatus(compra)}</td>
                <td>
                  <button onClick={() => deleteCompra(compra._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {compras.length === 0 && (
              <tr>
                <td colSpan="8" align="center">No hay órdenes registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal para crear nueva orden de compra */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Nueva Orden de Compra"
        style={{
          content: { width: '600px', margin: 'auto' }
        }}
      >
        <h2>
          Nueva Orden de Compra -{' '}
          {modalTipo &&
            modalTipo.charAt(0).toUpperCase() + modalTipo.slice(1)}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveNewOrder();
          }}
        >
          {/* Datos generales de la orden */}
          <div>
            <label>Proveedor:</label>
            <input
              type="text"
              value={newOrderData.proveedor}
              onChange={(e) =>
                setNewOrderData({ ...newOrderData, proveedor: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Fecha de Pedido:</label>
            <input
              type="date"
              value={newOrderData.fechaPedido}
              onChange={(e) =>
                setNewOrderData({ ...newOrderData, fechaPedido: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Lugar de Entrega:</label>
            <input
              type="text"
              value={newOrderData.lugarEntrega}
              onChange={(e) =>
                setNewOrderData({
                  ...newOrderData,
                  lugarEntrega: e.target.value
                })
              }
              required
            />
          </div>
          <hr />
          <h3>Detalles de la Orden</h3>
          {/* Sección para cargar los componentes de la orden */}
          <div>
            {newOrderData.detalles.map((detalle, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Código"
                  value={detalle.codigo}
                  onChange={(e) => {
                    const nuevosDetalles = [...newOrderData.detalles];
                    nuevosDetalles[index].codigo = e.target.value;
                    setNewOrderData({ ...newOrderData, detalles: nuevosDetalles });
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={detalle.descripcion}
                  onChange={(e) => {
                    const nuevosDetalles = [...newOrderData.detalles];
                    nuevosDetalles[index].descripcion = e.target.value;
                    setNewOrderData({ ...newOrderData, detalles: nuevosDetalles });
                  }}
                  required
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={detalle.cantidad}
                  onChange={(e) => {
                    const nuevosDetalles = [...newOrderData.detalles];
                    nuevosDetalles[index].cantidad = Number(e.target.value);
                    setNewOrderData({ ...newOrderData, detalles: nuevosDetalles });
                  }}
                  required
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={addDetailRow}>
            Agregar detalle manualmente
          </button>
          <br /><br />
          <div>
            <label>Importar desde Excel:</label>
            <input type="file" accept=".xlsx, .xls" onChange={handleExcelImport} />
          </div>
          <br />
          <div>
            <button type="button" onClick={handleImportFromPresupuesto}>
              Importar desde Presupuesto
            </button>
          </div>
          <hr />
          <button type="submit">Guardar Orden de Compra</button>
          <button type="button" onClick={closeModal}>Cancelar</button>
        </form>
      </Modal>
    </div>
    </div>
  );
};

export default ComprasPage;
