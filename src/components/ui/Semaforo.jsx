import React from "react";
import styles from "../../styles/components/Semaforo.module.css";

const Semaforo = ({ estado = "gris", texto = "" }) => {
  let className = styles.base;

  switch (estado) {
    case "verde":
      className += ` ${styles.verde}`;
      break;
    case "naranja":
      className += ` ${styles.naranja}`;
      break;
    case "rojo":
      className += ` ${styles.rojo}`;
      break;
    case "blanco":
      className += ` ${styles.blanco}`;
      break;
    case "negro":
      className += ` ${styles.negro}`;
      break;
    case "gris":
    default:
      className += ` ${styles.gris}`;
      break;
  }

  return <span className={className}>{texto}</span>;
};

export default Semaforo;
