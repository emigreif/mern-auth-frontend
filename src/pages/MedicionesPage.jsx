// frontend/src/pages/MedicionesPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const MedicionesPage = () => {
  const { state } = useLocation(); // Recibe la obra desde el dashboard
  const obra = state?.obra;
  const [ubicaciones, setUbicaciones] = useState([]);
  const [mediciones, setMediciones] = useState({});
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const { user } = useAuth();

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const res = await fetch(`${API_URL}/api/ubicaciones?obra=${obra._id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener ubicaciones');
        const data = await res.json();
        setUbicaciones(data);
      } catch (error) {
        console.error('Error fetching ubicaciones:', error);
      }
    };

    if (obra && user) {
      fetchUbicaciones();
    }
  }, [API_URL, obra, user]);

  // Agrupar ubicaciones por piso
  const ubicacionesPorPiso = ubicaciones.reduce((acc, ubicacion) => {
    acc[ubicacion.piso] = acc[ubicacion.piso] || [];
    acc[ubicacion.piso].push(ubicacion);
    return acc;
  }, {});

  const handleMeasurementChange = (id, field, value) => {
    setMediciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const saveMeasurement = async (ubicacionId) => {
    const payload = mediciones[ubicacionId];
    try {
      const res = await fetch(`${API_URL}/api/mediciones`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ubicacion: ubicacionId, ...payload })
      });
      if (!res.ok) throw new Error('Error al guardar medición');
      alert('Medición guardada');
    } catch (error) {
      console.error('Error saving measurement:', error);
    }
  };

  return (
    <div className="page-background">
      <div className="page-container">
        <h1>Mediciones para {obra?.nombre}</h1>
        {Object.keys(ubicacionesPorPiso).map(piso => (
          <div key={piso}>
            <h2>Piso: {piso}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {ubicacionesPorPiso[piso].map(ubicacion => (
                <div key={ubicacion._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '220px' }}>
                  <p><strong>Ubicación:</strong> {ubicacion.ubicacion}</p>
                  <p>
                    <strong>Tipología:</strong>{' '}
                    {ubicacion.tipologias && ubicacion.tipologias.length > 0
                      ? ubicacion.tipologias.join(', ')
                      : 'No asignada'}
                  </p>
                  <div>
                    <label>Ancho Relevado:</label>
                    <input
                      type="number"
                      value={mediciones[ubicacion._id]?.anchoRelevado || ''}
                      onChange={(e) => handleMeasurementChange(ubicacion._id, 'anchoRelevado', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Alto Relevado:</label>
                    <input
                      type="number"
                      value={mediciones[ubicacion._id]?.altoRelevado || ''}
                      onChange={(e) => handleMeasurementChange(ubicacion._id, 'altoRelevado', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Observaciones:</label>
                    <textarea
                      value={mediciones[ubicacion._id]?.observaciones || ''}
                      onChange={(e) => handleMeasurementChange(ubicacion._id, 'observaciones', e.target.value)}
                    ></textarea>
                  </div>
                  <button onClick={() => saveMeasurement(ubicacion._id)}>Guardar Medición</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicionesPage;
