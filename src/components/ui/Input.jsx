// src/components/ui/Input.jsx
import React from "react";
import styles from "../../styles/components/Form.module.css";

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}) => {
  const inputValue = type === "number" && (value === null || value === undefined || isNaN(value))
    ? 0
    : value;

  return (
    <div className={styles.formGroup}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        className={styles.input}
        value={inputValue}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default Input;
