// src/components/ui/SearchBar.jsx
import React from "react";
import styles from "../../styles/components/SearchBar.module.css";

export default function SearchBar({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <input
      type="text"
      className={styles.searchInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
