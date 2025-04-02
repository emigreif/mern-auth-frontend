// src/components/ui/Table.jsx
import React, { useState } from "react";
import styles from "../../styles/components/Table.module.css";

export default function Table({ headers = [], children, onSort, sortConfig }) {
  const [hoveredCol, setHoveredCol] = useState(null);

  // Soporta headers como string o { key, label }
  const normalizeHeader = (header) =>
    typeof header === "string" ? { key: header, label: header } : header;

  const normalizedHeaders = headers.map(normalizeHeader);

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {normalizedHeaders.map(({ key, label }) => (
            <th
              key={key}
              onClick={() => key !== "acciones" && onSort?.(key)}
              onMouseEnter={() => setHoveredCol(key)}
              onMouseLeave={() => setHoveredCol(null)}
              style={{ cursor: key !== "acciones" ? "pointer" : "default" }}
            >
              {label}
              {hoveredCol === key || sortConfig?.key === key ? (
                <span style={{ marginLeft: 5 }}>{getSortIcon(key)}</span>
              ) : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
