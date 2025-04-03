import React from "react";
import styles from "../../styles/components/Semaforo.module.css";
import classNames from "classnames";

const Semaforo = ({ estado = "gris", texto = "" }) => {
  const colorClass = {
    verde: styles.verde,
    naranja: styles.naranja,
    rojo: styles.rojo,
    blanco: styles.blanco,
    negro: styles.negro,
    gris: styles.gris
  }[estado] || styles.gris;

  return (
    <span className={classNames(styles.base, colorClass)}>
      {texto}
    </span>
  );
};

export default Semaforo;
