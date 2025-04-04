// src/components/ui/Checkbox.jsx
import React from "react";
import styles from "../../styles/components/Form.module.css";

const Checkbox = ({ label, name, checked, onChange }) => {
  return (
    <div className={styles.formGroup}>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
