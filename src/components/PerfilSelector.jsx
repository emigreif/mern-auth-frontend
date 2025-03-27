// src/components/PerfilSelector.jsx
import React from "react";
import ModalBase from "./ModalBase.jsx";
import Button from "./Button.jsx";

const PerfilSelector = ({ isOpen, onClose, perfiles = [], onSelectPerfil }) => {
  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Selecciona tu Perfil">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {perfiles.map((perfil) => (
          <Button
            key={perfil._id}
            onClick={() => {
              onSelectPerfil(perfil);
              onClose();
            }}
          >
            {perfil.nombre}
          </Button>
        ))}
      </div>
    </ModalBase>
  );
};

export default PerfilSelector;
