// src/components/ui/Table.jsx
import React from "react";
import styles from "../../styles/components/Table.module.css";

export default function Table({ headers = [], data = [], renderRow }) {
  if (!data.length) return <p className={styles.noData}>No hay resultados</p>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((head, i) => <th key={i}>{head}</th>)}
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
