// src/components/ui/FormGroup.jsx
import React from "react";
import styles from "../../styles/components/Form.module.css";

const FormGroup = ({ label, htmlFor, children }) => (
  <div className={styles.formGroup}>
    {label && <label htmlFor={htmlFor}>{label}</label>}
    {children}
  </div>
);

export default FormGroup;
