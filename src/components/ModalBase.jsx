// src/components/ModalBase.jsx
import React from "react";
import styles from "../styles/modals/ModalBase.module.css";

const ModalBase = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.content} onClick={handleContentClick}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        {title && <h2>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ModalBase;
