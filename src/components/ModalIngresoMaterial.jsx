// frontend/src/components/ModalIngresoMaterial.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ModalIngresoMaterial({ compra, onClose, onSaved }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [numeroRemito, setNumeroRemito] = useState("");
  const [items, setItems] = useState([]); 
  // items: [{ itemId, cantidadIngresada }, ...]

  // Inicializar "items" con la lista de items (pedido/vidrios/accesorios) que no estén 100% ingresados
  // o algo similar

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/compras/ingreso/${compra._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ numeroRemito, items })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al ingresar material");
      }
      await res.json();
      onSaved();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(ev) => ev.stopPropagation()}>
        <h2>Ingreso de Material - OC #{compra.numeroOC}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Número de Remito</label>
            <input
              type="text"
              value={numeroRemito}
              onChange={(e) => setNumeroRemito(e.target.value)}
            />
          </div>

          {/* Renderizar la lista de ítems, con input para la cantidadIngresada */}
          {/* Si es aluminio => compra.pedido. Si es vidrios => compra.vidrios, etc. */}
          {compra.tipo === "aluminio" && (
            <div>
              <h3>Ítems (Perfiles)</h3>
              {compra.pedido.map((p) => (
                <div key={p._id}>
                  <span>{p.codigo} - {p.descripcion}</span>
                  <input
                    type="number"
                    placeholder="Cantidad a ingresar"
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setItems((prev) => {
                        const existing = prev.find((x) => x.itemId === p._id);
                        if (existing) {
                          existing.cantidadIngresada = val;
                          return [...prev];
                        } else {
                          return [...prev, { itemId: p._id, cantidadIngresada: val }];
                        }
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Similar para vidrios, accesorios */}
          {/* ... */}

          <div style={{ marginTop: "1rem" }}>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
