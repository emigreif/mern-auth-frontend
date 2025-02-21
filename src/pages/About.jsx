// frontend/src/pages/About.jsx
import React from 'react';
import './About.css'; // Importa el CSS para About

const About = () => {
  return (
    <div className="about-background">
      <div className="about-container">
        <h1>About Planner</h1>
        <h2>by Greif Software Solutions</h2>

        <section>
          <h3>Quiénes somos</h3>
          <p>
            Somos Greif Software Solutions, una empresa fundada por profesionales apasionados 
            por la innovación y la eficiencia en la industria de la construcción y la fabricación 
            de aberturas. Este proyecto surge de la experiencia y el compromiso de nuestro equipo 
            con el desarrollo de software especializado que 
            transforme la manera en que se gestionan los proyectos productivos.
          </p>
        </section>

        <section>
          <h3>Qué es Planner</h3>
          <p>
            Planner es nuestra plataforma central, diseñada para ser la herramienta indispensable 
            en el día a día de quienes buscan orden, trazabilidad, transparencia y seguridad en 
            sus procesos de producción. En un solo entorno digital, Planner integra la gestión de 
            obras, el control de insumos, la planificación de etapas y la comunicación entre todos 
            los involucrados, con el fin de eliminar ineficiencias y prevenir errores.
          </p>
        </section>

        <section>
          <h3>Ventajas de usar Planner</h3>

          <h4>Orden y organización</h4>
          <ul>
            <li>Agrupa toda la información clave (fechas, avances, materiales) para que tu equipo pueda acceder de forma clara y concisa.</li>
            <li>Centraliza la comunicación y los documentos relacionados con cada proyecto.</li>
          </ul>

          <h4>Trazabilidad total</h4>
          <ul>
            <li>Registra cada paso del proceso productivo: desde la orden de compra de insumos, hasta el remito de entrega final.</li>
            <li>Permite identificar rápidamente dónde se encuentran cuellos de botella o retrasos.</li>
          </ul>

          <h4>Transparencia</h4>
          <ul>
            <li>Ofrece visibilidad a todos los participantes (proveedores, clientes, personal interno), generando confianza a lo largo de toda la cadena.</li>
            <li>Facilita la toma de decisiones con datos concretos y actualizados en tiempo real.</li>
          </ul>

          <h4>Seguridad de la información</h4>
          <ul>
            <li>Protege tus datos con accesos y permisos configurables, evitando la divulgación de información sensible.</li>
            <li>Implementa respaldos automáticos y mantiene un histórico detallado de versiones y cambios.</li>
          </ul>

          <h4>Escalabilidad y adaptación</h4>
          <ul>
            <li>Diseñado para crecer junto a tu empresa: puedes incorporar más módulos o funcionalidades según la complejidad de tus proyectos.</li>
            <li>Se ajusta a distintas etapas de la industria de la construcción y la producción de aberturas, ofreciendo un entorno flexible y personalizable.</li>
          </ul>
        </section>

        <section>
          <h3>Nuestra filosofía</h3>
          <p>
            En Greif Software Solutions creemos que la innovación y la tecnología deben estar 
            al servicio de la mejora continua. Con Planner, buscamos brindar una plataforma 
            confiable y amigable que aporte valor real a nuestros clientes y los ayude a 
            optimizar sus procesos productivos de principio a fin.
          </p>
          <p>
            Con Planner, tendrás la certeza de que tu producción está bajo control, con la 
            información necesaria para tomar decisiones oportunas y la confiabilidad que 
            otorga una gestión transparente y segura. ¡Te invitamos a descubrir cómo 
            nuestra solución puede impulsar la eficiencia de tu organización!
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
