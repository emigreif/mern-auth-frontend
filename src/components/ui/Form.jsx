// src/components/ui/Form.jsx
import React from "react";
import styles from "../../styles/components/Form.module.css";

export default function Form({ onSubmit, children, className = "", ...props }) {
  return (
    <form
      onSubmit={onSubmit}
      className={`${styles.form} ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}
