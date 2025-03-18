// src/components/PerfilSelector/PerfilSelector.jsx
import React from "react";
import ModalBase from "../ModalBase/ModalBase.jsx";

/**
 * Props:
 *  - isOpen
 *  - onClose
 *  - perfiles: array de { _id, nombre }
 *  - onSelectPerfil(perfil)
 */
const PerfilSelector = ({ isOpen, onClose, perfiles = [], onSelectPerfil }) => {
  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Selecciona tu Perfil">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {perfiles.map((perfil) => (
          <button
            key={perfil._id}
            onClick={() => {
              onSelectPerfil(perfil);
              onClose();
            }}
          >
            {perfil.nombre}
          </button>
        ))}
      </div>
    </ModalBase>
  );
};

export default PerfilSelector;
