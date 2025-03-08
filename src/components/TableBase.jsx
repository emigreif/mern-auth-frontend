import React from "react";
import "./TableBase.css";

const TableBase = ({ columns, data, actions }) => {
  return (
    <div className="table-container">
      <table className="table-base">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)}>No hay datos</td></tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>{row[col]}</td>
                ))}
                {actions && (
                  <td>
                    {actions.map((action, actionIndex) => (
                      <button key={actionIndex} onClick={() => action.onClick(row)}>
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableBase;