import React, { useState } from "react";
import "../styles/Obras.css";
import { FaMapMarkerAlt } from "react-icons/fa"; // Ícono para la ubicación

const ObrasList = () => {
  const [obras, setObras] = useState([
    {
      id: 1,
      referencia: "001",
      nombre: "Edificio Central",
      direccion: "Calle Falsa 123, Ciudad",
      contacto: "Juan Pérez - 123456789",
      estado: { accesorios: "cumplido", vidrios: "pendiente", perfiles: "proximo", produccion: "pendiente" }
    },
    {
      id: 2,
      referencia: "002",
      nombre: "Residencia Moderna",
      direccion: "Av. Siempre Viva 742, Springfield",
      contacto: "Carlos Rodríguez - 987654321",
      estado: { accesorios: "pendiente", vidrios: "vencido", perfiles: "cumplido", produccion: "pendiente" }
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const obrasPorPagina = 5;
  const [showModal, setShowModal] = useState(false);
  const [nuevaObra, setNuevaObra] = useState({
    referencia: "",
    nombre: "",
    direccion: "",
    contacto: ""
  });

  const totalPages = Math.ceil(obras.length / obrasPorPagina);
  const indexOfLastObra = currentPage * obrasPorPagina;
  const indexOfFirstObra = indexOfLastObra - obrasPorPagina;
  const currentObras = obras.slice(indexOfFirstObra, indexOfLastObra);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleInputChange = (e) => {
    setNuevaObra({ ...nuevaObra, [e.target.name]: e.target.value });
  };

  const agregarObra = () => {
    if (nuevaObra.nombre && nuevaObra.direccion && nuevaObra.contacto) {
      const nuevaReferencia = (obras.length + 1).toString().padStart(3, "0"); // Genera referencia auto-incremental
      setObras([...obras, { ...nuevaObra, referencia: nuevaReferencia, estado: { accesorios: "pendiente", vidrios: "pendiente", perfiles: "pendiente", produccion: "pendiente" } }]);
      setShowModal(false);
      setNuevaObra({ referencia: "", nombre: "", direccion: "", contacto: "" });
    } else {
      alert("Completa todos los campos antes de agregar la obra.");
    }
  };

  return (
    <div className="obras-container">
      <div className="header">
        <h1>Lista de Obras</h1>
        <button className="add-button" onClick={() => setShowModal(true)}>Agregar Obra</button>
      </div>

      <div className="obras-list">
        {currentObras.map((obra) => (
          <div key={obra.id} className="obra-card">
            <div className="obra-header">
              {obra.referencia} - {obra.nombre}
            </div>
            <div className="obra-info">
              <span>{obra.direccion}</span>
              <FaMapMarkerAlt className="location-icon" title="Ver ubicación" />
            </div>
            <div className="obra-contacto">{obra.contacto}</div>
            <div className="estados">
              <span className={`estado-${obra.estado.accesorios}`}>Accesorios</span>
              <span className={`estado-${obra.estado.vidrios}`}>Vidrios</span>
              <span className={`estado-${obra.estado.perfiles}`}>Perfiles</span>
              <span className={`estado-${obra.estado.produccion}`}>Producción</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Siguiente</button>
      </div>

      {showModal && (
        <div className="modal-background">
          <div className="modal-container">
            <h2>Agregar Nueva Obra</h2>
            <input type="text" name="nombre" placeholder="Nombre de la obra" value={nuevaObra.nombre} onChange={handleInputChange} required />
            <input type="text" name="direccion" placeholder="Dirección" value={nuevaObra.direccion} onChange={handleInputChange} required />
            <input type="text" name="contacto" placeholder="Contacto" value={nuevaObra.contacto} onChange={handleInputChange} required />
            <button onClick={agregarObra}>Guardar</button>
            <button onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObrasList;
