// src/pages/Planner.jsx
import React from "react";
import styles from "../styles/pages/Planner.module.css";

/**
 * Página "Planner"
 * - Descripción general de las funcionalidades
 * - Texto que explique cada módulo
 */
const Planner = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Planner</h1>
        <p>La herramienta integral para optimizar tus procesos de producción</p>
      </div>

      <p className={styles.introText}>
        Planner es una plataforma diseñada para gestionar todas las etapas de tu
        proyecto: desde la medición en obra, pasando por la producción y las
        compras, hasta la entrega final y la contabilidad.
      </p>

      {/* Sección 1: Gestión de Presupuestos y Obras */}
      <div className={styles.section}>
        <h2>Gestión de Presupuestos y Obras</h2>
        <ul>
          <li>
            Creación y aprobación de presupuestos de manera centralizada, con
            historial de cambios.
          </li>
          <li>
            Integración con la base de clientes para asignar obras y hacer
            seguimiento de cada proyecto.
          </li>
        </ul>
      </div>

      {/* Sección 2: Mediciones en Campo */}
      <div className={styles.section}>
        <h2>Mediciones en Campo</h2>
        <ul>
          <li>
            Carga de dimensiones de cada vano y asignación de tipologías
            correspondientes.
          </li>
          <li>
            Reportes comparando lo presupuestado vs. lo medido, detectando
            diferencias a tiempo.
          </li>
        </ul>
      </div>

      {/* Sección 3: Compras y Control de Insumos */}
      <div className={styles.section}>
        <h2>Compras y Control de Insumos</h2>
        <ul>
          <li>
            Generación de órdenes de compra para perfiles, vidrios y accesorios,
            gestionando fechas de entrega y stock.
          </li>
          <li>
            Seguimiento de proveedores y alertas de faltantes o demoras en
            entregas.
          </li>
        </ul>
      </div>

      {/* Sección 4: Producción y Planificación */}
      <div className={styles.section}>
        <h2>Producción y Planificación</h2>
        <ul>
          <li>
            Definición de fechas clave (corte, armado, vidriado) y asignación de
            recursos humanos.
          </li>
          <li>
            Tablero de producción con indicadores tipo semáforo para evitar
            cuellos de botella.
          </li>
        </ul>
      </div>

      {/* Sección 5: Logística y Montaje */}
      <div className={styles.section}>
        <h2>Logística y Montaje</h2>
        <ul>
          <li>
            Coordinación del despacho de materiales y herramientas a obra, con
            remitos y calendario de instaladores.
          </li>
          <li>
            Control detallado de la colocación final y verificación de calidad.
          </li>
        </ul>
      </div>

      {/* Sección 6: Pañol y Herramientas */}
      <div className={styles.section}>
        <h2>Pañol y Herramientas</h2>
        <ul>
          <li>
            Administración de salidas y devoluciones de máquinas, evitando
            pérdidas y asegurando disponibilidad.
          </li>
          <li>
            Programación de mantenimientos para prevenir paradas inesperadas.
          </li>
        </ul>
      </div>

      {/* Sección 7: Cobranzas y Balance de Obra */}
      <div className={styles.section}>
        <h2>Cobranzas y Balance de Obra</h2>
        <ul>
          <li>
            Registro de pagos (facturado y no facturado), cálculo de saldos
            pendientes y aplicación de índices (CAC, dólar).
          </li>
          <li>
            Visión clara de la rentabilidad y toma de decisiones financieras
            fundamentadas.
          </li>
        </ul>
      </div>

      {/* Sección 8: Dashboard y Alertas */}
      <div className={styles.section}>
        <h2>Dashboard y Alertas</h2>
        <ul>
          <li>
            Panel unificado para monitorear retrasos, faltantes y próximos
            vencimientos.
          </li>
          <li>
            Alertas automáticas para todo el equipo, garantizando la fluidez de
            la información.
          </li>
        </ul>
      </div>

      {/* Conclusión */}
      <div className={styles.section}>
        <p>
          Con Planner, tu empresa contará con un sistema robusto y colaborativo,
          pensado para agilizar cada fase del proyecto y garantizar la
          transparencia en todas las operaciones.
        </p>
      </div>
    </div>
  );
};

export default Planner;
