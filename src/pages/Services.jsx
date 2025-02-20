// frontend/src/pages/Services.jsx
import React from 'react';
import './Services.css'; // Importa el CSS que definiremos abajo

const Services = () => {
  return (
    <div className="services-background">
      <div className="services-container">
        <h1>Servicios de Planner</h1>
        <p className="intro-text">
          Planner es la herramienta integral para optimizar tus procesos de producción y organizar cada etapa 
          de tu proyecto. Desde la medición en obra hasta la cobranza final, Planner te da transparencia, 
          trazabilidad y control absoluto. A continuación, te mostramos los principales servicios que ofrece:
        </p>

        <div className="services-section">
          <h2>Gestión de Presupuestos y Obras</h2>
          <ul>
            <li>Creá y aprobá presupuestos de manera centralizada, con toda la información unificada en una sola plataforma.</li>
            <li>Mantené un historial de cambios y variantes para brindar mayor claridad y profesionalismo a tus clientes.</li>
          </ul>
        </div>

        <div className="services-section">
          <h2>Mediciones en Campo</h2>
          <ul>
            <li>Capturá las dimensiones de cada vano y asigná las tipologías correspondientes directamente desde tu smartphone o tablet.</li>
            <li>Visualizá reportes comparando lo presupuestado vs. lo medido, detectando diferencias a tiempo y tomando decisiones con información confiable.</li>
          </ul>
        </div>

        {/* ... El resto de secciones con la misma estructura ... */}

        <div className="services-section">
          <h2>¿Por qué Planner?</h2>
          <ul>
            <li><strong>Trazabilidad completa:</strong> Cada acción queda registrada, aportando transparencia y confianza.</li>
            <li><strong>Ahorro de tiempo:</strong> Automatizá procesos repetitivos y evitá reprocesos por falta de información.</li>
            <li><strong>Plataforma colaborativa:</strong> Tanto el equipo interno como clientes y proveedores trabajan con datos actualizados en tiempo real.</li>
            <li><strong>Escalabilidad:</strong> Funciona igual de bien para proyectos pequeños como para grandes obras, con la posibilidad de agregar módulos según crezcan tus necesidades.</li>
          </ul>
          <p>
            Con Planner, ordenás, optimizás y asegurás cada fase de tu producción, logrando así mejores resultados y 
            una relación más fluida con tus clientes y proveedores. ¡Dale a tu negocio la eficiencia y el control 
            que merece!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
