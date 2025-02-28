import React, { useState } from "react";
import "../styles/Panol.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faWrench, faCubes, faTools } from "@fortawesome/free-solid-svg-icons";

const Panol = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // Para diferenciar qué se está agregando

  const [herramientas, setHerramientas] = useState([
    { id: 1, descripcion: "Taladro percutor", marca: "Bosch", modelo: "GBH 2-26", identificacion: "TAL-001" },
    { id: 2, descripcion: "Llave Inglesa", marca: "Stanley", modelo: "12”", identificacion: "LLA-002" },
  ]);

  const [perfiles, setPerfiles] = useState([
    { id: 1, codigo: "PER-001", cantidad: 50, descripcion: "Perfil U", largo: "6m", color: "Negro" },
    { id: 2, codigo: "PER-002", cantidad: 30, descripcion: "Perfil H", largo: "4m", color: "Blanco" },
  ]);

  const [accesorios, setAccesorios] = useState([
    { id: 1, codigo: "ACC-001", descripcion: "Bisagra 90°", color: "Plata", cantidad: 200, marca: "Roto" },
    { id: 2, codigo: "ACC-002", descripcion: "Manija de aluminio", color: "Negro", cantidad: 150, marca: "Schüco" },
  ]);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="panol-container">
      <h1>Pañol - Gestión de Stock</h1>

      {/* Botones de Agregar */}
      <div className="panol-buttons">
        <button onClick={() => openModal("herramienta")}>
          <FontAwesomeIcon icon={faWrench} /> Agregar Herramienta
        </button>
        <button onClick={() => openModal("perfil")}>
          <FontAwesomeIcon icon={faCubes} /> Agregar Perfil
        </button>
        <button onClick={() => openModal("accesorio")}>
          <FontAwesomeIcon icon={faTools} /> Agregar Accesorio
        </button>
      </div>

      {/* Herramientas */}
      <div className="panol-section">
        <h2>🛠️ Herramientas</h2>
        <div className="panol-list">
          {herramientas.map((item) => (
            <div key={item.id} className="panol-card">
              <p><strong>{item.descripcion}</strong></p>
              <p>Marca: {item.marca} | Modelo: {item.modelo}</p>
              <p>ID: {item.identificacion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Perfiles */}
      <div className="panol-section">
        <h2>📏 Stock de Perfiles</h2>
        <div className="panol-list">
          {perfiles.map((item) => (
            <div key={item.id} className="panol-card">
              <p><strong>{item.descripcion}</strong></p>
              <p>Código: {item.codigo} | Cantidad: {item.cantidad}</p>
              <p>Largo: {item.largo} | Color: {item.color}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accesorios */}
      <div className="panol-section">
        <h2>🔩 Stock de Accesorios</h2>
        <div className="panol-list">
          {accesorios.map((item) => (
            <div key={item.id} className="panol-card">
              <p><strong>{item.descripcion}</strong></p>
              <p>Código: {item.codigo} | Cantidad: {item.cantidad}</p>
              <p>Color: {item.color} | Marca: {item.marca}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar nuevo registro */}
      {showModal && (
        <div className="modal-background" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h2>Agregar {modalType === "herramienta" ? "Herramienta" : modalType === "perfil" ? "Perfil" : "Accesorio"}</h2>
            <input type="text" placeholder="Descripción" />
            <input type="text" placeholder={modalType === "perfil" ? "Código" : "Marca"} />
            <input type="text" placeholder={modalType === "perfil" ? "Largo" : "Modelo"} />
            <input type="number" placeholder="Cantidad" />
            <button onClick={() => setShowModal(false)}>Guardar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panol;
