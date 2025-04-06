import React from "react";
import styles from "../../styles/components/Filtro.module.css";
import Input from "./Input.jsx";
import Select from "./Select.jsx";
import Button from "./Button.jsx";

export default function Filtro({
  filtros,
  onChange,
  onReset,
  children, // opcional: para insertar más filtros personalizados
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.filtros}>
        {filtros.map((filtro) => {
          if (filtro.type === "select") {
            return (
              <Select
                key={filtro.name}
                name={filtro.name}
                label={filtro.label}
                value={filtro.value}
                onChange={onChange}
                options={filtro.options}
              />
            );
          }
          return (
            <Input
              key={filtro.name}
              name={filtro.name}
              label={filtro.label}
              value={filtro.value}
              onChange={onChange}
              placeholder={filtro.placeholder || ""}
            />
          );
        })}
        {children}
      </div>
      <div className={styles.acciones}>
        <Button onClick={onReset} variant="secondary">Limpiar</Button>
      </div>
    </div>
  );
}
