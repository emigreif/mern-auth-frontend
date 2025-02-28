import React, { useState } from "react";
import "../styles/Configuracion.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCogs, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Configuracion = () => {
  const [config, setConfig] = useState({
    roles: ["Administrador", "Producción", "Ventas"],
    indicesSaldo: 1.05,
    impuestos: [{ nombre: "IVA", porcentaje: 21 }, { nombre: "IIBB", porcentaje: 3.5 }],
    costoHora: 2000,
    tiemposProduccion: { perfiles: 2, dvh: 4, accesorios: 3 },
    topeAccesorios: 5,
    stockCritico: { perfiles: 20, accesorios: 50 }
  });

  const handleChange = (e, section, key, index) => {
    const newConfig = { ...config };
    if (index !== undefined) {
      newConfig[section][index][key] = e.target.value;
    } else {
      newConfig[section][key] = e.target.value;
    }
    setConfig(newConfig);
  };

  const addImpuesto = () => {
    setConfig({
      ...config,
      impuestos: [...config.impuestos, { nombre: "", porcentaje: 0 }]
    });
  };

  return (
    <div className="config-container">
      <h1><FontAwesomeIcon icon={faCogs} /> Configuración General</h1>

      {/* Roles de Usuario */}
      <div className="config-section">
        <h2>Roles de Usuario</h2>
        <ul>
          {config.roles.map((role, idx) => <li key={idx}>{role}</li>)}
        </ul>
        <button className="add-button">
          <FontAwesomeIcon icon={faPlusCircle} /> Agregar Rol
        </button>
      </div>

      {/* Índices de Saldo */}
      <div className="config-section">
        <h2>Índices de Saldo</h2>
        <input type="number" step="0.01" value={config.indicesSaldo} onChange={(e) => handleChange(e, "indicesSaldo")} />
      </div>

      {/* Lista de Impuestos */}
      <div className="config-section">
        <h2>Lista de Impuestos</h2>
        {config.impuestos.map((imp, idx) => (
          <div key={idx} className="config-impuesto">
            <input type="text" value={imp.nombre} placeholder="Nombre" onChange={(e) => handleChange(e, "impuestos", "nombre", idx)} />
            <input type="number" value={imp.porcentaje} placeholder="%" onChange={(e) => handleChange(e, "impuestos", "porcentaje", idx)} />
          </div>
        ))}
        <button className="add-button" onClick={addImpuesto}>
          <FontAwesomeIcon icon={faPlusCircle} /> Agregar Impuesto
        </button>
      </div>

      {/* Costos y Tiempos de Producción */}
      <div className="config-section">
        <h2>Costo y Tiempos de Producción</h2>
        <label>Costo por Hora</label>
        <input type="number" value={config.costoHora} onChange={(e) => handleChange(e, "costoHora")} />

        <label>Tiempo en Producción (horas)</label>
        <div className="config-produccion">
          <span>Perfiles: <input type="number" value={config.tiemposProduccion.perfiles} onChange={(e) => handleChange(e, "tiemposProduccion", "perfiles")} /></span>
          <span>DVH: <input type="number" value={config.tiemposProduccion.dvh} onChange={(e) => handleChange(e, "tiemposProduccion", "dvh")} /></span>
          <span>Accesorios: <input type="number" value={config.tiemposProduccion.accesorios} onChange={(e) => handleChange(e, "tiemposProduccion", "accesorios")} /></span>
        </div>
      </div>

      {/* Tiempos de Pedido y Stock Crítico */}
      <div className="config-section">
        <h2>Parámetros Adicionales</h2>
        <label>Tope días para pedido de accesorios</label>
        <input type="number" value={config.topeAccesorios} onChange={(e) => handleChange(e, "topeAccesorios")} />

        <label>Stock Crítico</label>
        <div className="config-produccion">
          <span>Perfiles: <input type="number" value={config.stockCritico.perfiles} onChange={(e) => handleChange(e, "stockCritico", "perfiles")} /></span>
          <span>Accesorios: <input type="number" value={config.stockCritico.accesorios} onChange={(e) => handleChange(e, "stockCritico", "accesorios")} /></span>
        </div>
      </div>

      {/* Guardar Configuración */}
      <button className="save-button">
        <FontAwesomeIcon icon={faSave} /> Guardar Configuración
      </button>
    </div>
  );
};

export default Configuracion;
