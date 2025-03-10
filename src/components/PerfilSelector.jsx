import React from "react";

const PerfilSelector = ({ perfiles, onSelectPerfil }) => {
  return (
    <div className="modal-background">
      <div className="modal-container">
        <h2>Selecciona tu Perfil</h2>
        {perfiles.map((perfil) => (
          <button key={perfil._id} onClick={() => onSelectPerfil(perfil)}>
            {perfil.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PerfilSelector;
