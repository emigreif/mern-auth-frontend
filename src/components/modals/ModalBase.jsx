// src/components/modals/ModalBase.jsx
import React from "react";
import Button from "../ui/Button.jsx";
import styles from "../../styles/modals/GlobalModal.module.css";

const ModalBase = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => onClose();
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={handleContentClick}>
        <div>
          <Button
            variant="secondary"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✖
          </Button>

          {title && <h2>{title}</h2>}

          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalBase;
