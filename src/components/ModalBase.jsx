// src/components/ModalBase.jsx
import React from "react";

const ModalBase = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation(); // Evita que el click en contenido cierre el modal
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={handleContentClick}>
        <button className="modal-close" onClick={onClose}>✖</button>
        {title && <h2>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ModalBase;
