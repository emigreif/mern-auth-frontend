// src/components/PerfilSelector.jsx
import React from "react";
import ModalBase from "./ModalBase.jsx";

const PerfilSelector = ({ isOpen, onClose, perfiles = [], onSelectPerfil }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Selecciona tu Perfil">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {perfiles.map((perfil) => (
          <button
            key={perfil._id}
            className="btn"
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
