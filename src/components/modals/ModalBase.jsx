// src/components/modals/modalBase.jsx
import React from "react";
import Button from "./Button.jsx";
import styles from "../styles/modals/GlobalModal.module.css";

const ModalBase = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => onClose();
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleContentClick}>
        <div className={styles.modalContent}>
          <Button variant="secondary" className={styles.closeBtn} onClick={onClose}>
            ✖
          </Button>
          {title && <h2>{title}</h2>}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalBase;
