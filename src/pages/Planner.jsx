// src/pages/Planner.jsx
import React from "react";
import styles from "../styles/pages/Info.module.css";

const Planner = () => {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <h1 className={styles.heroTitle}>Planner</h1>
        <p>La herramienta integral para optimizar tus procesos de producción</p>

        <p>
          Planner es una plataforma diseñada para gestionar todas las etapas de
          tu proyecto: desde la medición en obra, pasando por la producción y
          las compras, hasta la entrega final y la contabilidad.
        </p>
      </section>

      {/* Sección 1: Gestión de Presupuestos y Obras */}
      <section className={styles.section}>
        <h3>Gestión de Presupuestos y Obras</h3>
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
      </section>

      {/* Sección 2: Mediciones en Campo */}
      <section className={styles.section}>
        <h3>Mediciones en Campo</h3>
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
      </section>

      {/* Sección 3: Compras y Control de Insumos */}
      <section className={styles.section}>
        <h3>Compras y Control de Insumos</h3>
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
      </section>

      {/* Sección 4: Producción y Planificación */}
      <section className={styles.section}>
        <h3>Producción y Planificación</h3>
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
      </section>

      {/* Sección 5: Logística y Montaje */}
      <section className={styles.section}>
        <h3>Logística y Montaje</h3>
        <ul>
          <li>
            Coordinación del despacho de materiales y herramientas a obra, con
            remitos y calendario de instaladores.
          </li>
          <li>
            Control detallado de la colocación final y verificación de calidad.
          </li>
        </ul>
      </section>

      {/* Sección 6: Pañol y Herramientas */}
      <section className={styles.section}>
        <h3>Pañol y Herramientas</h3>
        <ul>
          <li>
            Administración de salidas y devoluciones de máquinas, evitando
            pérdidas y asegurando disponibilidad.
          </li>
          <li>
            Programación de mantenimientos para prevenir paradas inesperadas.
          </li>
        </ul>
      </section>

      {/* Sección 7: Cobranzas y Balance de Obra */}
      <section className={styles.section}>
        <h3>Cobranzas y Balance de Obra</h3>
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
      </section>

      {/* Sección 8: Dashboard y Alertas */}
      <section className={styles.section}>
        <h3>Dashboard y Alertas</h3>
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
      </section>

      {/* Conclusión */}
      <section className={styles.section}>
        <p>
          Con Planner, tu empresa contará con un sistema robusto y colaborativo,
          pensado para agilizar cada fase del proyecto y garantizar la
          transparencia en todas las operaciones.
        </p>
      </section>
    </div>
  );
};

export default Planner;
