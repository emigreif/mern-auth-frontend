// src/components/ui/Table.jsx

import React from "react";
import styles from "../../styles/components/Table.module.css";

export default function Table({ headers = {}, data = [], renderRow, onSort, sortConfig }) {
  if (!data.length) return <p className={styles.noData}>No hay resultados</p>;

  const keys = Object.keys(headers);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {keys.map((key) => (
            <th key={key} onClick={() => onSort(key)} style={{ cursor: "pointer" }}>
              {headers[key]}
              {sortConfig?.key === key && (
                sortConfig.direction === "asc" ? " 🔼" : " 🔽"
              )}
            </th>
          ))}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={item._id || idx}>{renderRow(item)}</tr>
        ))}
      </tbody>
    </table>
  );
}
