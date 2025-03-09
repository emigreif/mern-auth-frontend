import React from "react";
import "../styles/FormBase.css";

const FormBase = ({ fields = [], onSubmit, onCancel }) => {
  return (
    <form className="form-base" onSubmit={onSubmit}>
      {fields.length > 0 ? (
        fields.map((field, index) => (
          <div key={index} className="form-group">
            <label>{field.label}:</label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange || (() => {})}
              required={field.required || false}
            />
          </div>
        ))
      ) : (
        <p className="form-error">⚠️ No hay campos disponibles</p>
      )}

      <div className="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default FormBase;
