// src/components/ui/MultiSelect.jsx
import React from "react";
import Select from "react-select";
import styles from "../../styles/components/Form.module.css";

const MultiSelect = ({ label, name, value = [], onChange, options = [] }) => {
  const selectOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOptions = selectOptions.filter((opt) =>
    value.includes(opt.value)
  );

  return (
    <div className={styles.formGroup}>
      {label && <label>{label}</label>}
      <Select
        isMulti
        name={name}
        options={selectOptions}
        value={selectedOptions}
        onChange={(selected) => onChange(selected.map((opt) => opt.value))}
      />
    </div>
  );
};

export default MultiSelect;
