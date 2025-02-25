import React, { useState } from "react";
import "../styles/ProveedoresList.css";

const ProveedoresList = () => {
  const [showModal, setShowModal] = useState(false);
  const [proveedores, setProveedores] = useState([
    {
      id: 1,
      nombre: "Cristales SA",
      direccion: "Av. Vidrios 123",
      emails: ["contacto@cristales.com", "ventas@cristales.com"],
      telefono: "+54 11 2345 6789",
      whatsapp: "+54 9 11 5555 5555",
      balance: "$ 120.000 a favor",
      rubro: ["Vidrio"],
    },
    {
      id: 2,
      nombre: "Metalúrgica ABC",
      direccion: "Calle Perfiles 456",
      emails: ["info@metalabc.com"],
      telefono: "+54 11 8765 4321",
      whatsapp: "+54 9 11 4444 4444",
      balance: "$ 45.000 a pagar",
      rubro: ["Perfiles", "Accesorios"],
    }
  ]);

  return (
    <div className="proveedores-background">
      <div className="proveedores-container">
        <h1 className="proveedores-title">Lista de Proveedores</h1>
        <div className="header">
          <div className="search-container">
            <input type="text" placeholder="Buscar proveedor..." className="search-input" />
            <span className="search-icon">🔍</span>
          </div>
          <button className="add-button" onClick={() => setShowModal(true)}>
            Agregar Proveedor
          </button>
        </div>
        <div className="proveedores-list">
          {proveedores.map((prov) => (
            <div key={prov.id} className="proveedor-card">
              <div className="proveedor-header">
                <span className="proveedor-nombre">{prov.nombre}</span>
                <span className="proveedor-balance">{prov.balance}</span>
              </div>
              <div className="proveedor-info">
                <p>📍 {prov.direccion}</p>
                <p>📧 {prov.emails.join(", ")}</p>
                <p>📞 {prov.telefono}</p>
                <p>💬 {prov.whatsapp}</p>
              </div>
              <div className="proveedor-rubro">
                {prov.rubro.map((r, index) => (
                  <span key={index} className="rubro-tag">{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="modal-background" onClick={() => setShowModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <h2>Agregar Nuevo Proveedor</h2>
              <input type="text" placeholder="Nombre" />
              <input type="text" placeholder="Dirección" />
              <input type="email" placeholder="Email" />
              <input type="text" placeholder="Teléfono" />
              <input type="text" placeholder="WhatsApp" />
              <select>
                <option>Vidrio</option>
                <option>Perfiles</option>
                <option>Accesorios</option>
                <option>Compras Generales</option>
              </select>
              <button onClick={() => setShowModal(false)}>Guardar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProveedoresList;
