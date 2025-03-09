import React from "react";
import "../styles/TableBase.css";

const TableBase = ({ headers = [], data = [] }) => {
  return (
    <div className="table-container">
      {data.length > 0 ? (
        <table className="table-base">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="table-empty">⚠️ No hay datos disponibles</p>
      )}
    </div>
  );
};

export default TableBase;
