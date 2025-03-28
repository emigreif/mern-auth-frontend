// src/components/ui/Button.jsx
import React from "react";
import styles from "../../styles/components/Buttons.module.css";

const Button = ({ variant = "primary", children, className = "", ...props }) => {
  let btnClass = styles.btn; // Valor por defecto: primario

  if (variant === "secondary") {
    btnClass = `${styles.btn} ${styles["btn-secondary"]}`;
  } else if (variant === "danger") {
    btnClass = `${styles.btn} ${styles["btn-danger"]}`;
  }

  return (
    <button className={`${btnClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
