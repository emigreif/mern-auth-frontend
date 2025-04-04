import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase";
import Table from "../ui/Table";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function ModalVerMovimientosProveedor({ proveedorId, onClose }) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (proveedorId) fetchMovimientos();
  }, [proveedorId]);

  const fetchMovimientos = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/contabilidad/proveedor/${proveedorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("No se pudieron obtener los movimientos");
      const data = await res.json();
      setMovimientos(data || []);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderEstado = (tipo) => {
    if (tipo.includes("FACTURA")) return "Pendiente";
    if (tipo.includes("PAGO") || tipo.includes("CHEQUE")) return "Cerrado";
    return "Activo";
  };

  return (
    <ModalBase isOpen onClose={onClose} title="Movimientos del Proveedor">
      {errorMsg && <p style={{ color: "red", marginBottom: "1rem" }}>{errorMsg}</p>}

      {loading ? (
        <p>Cargando movimientos...</p>
      ) : movimientos.length === 0 ? (
        <p>No hay movimientos registrados.</p>
      ) : (
        <Table
          headers={["Tipo", "Fecha", "Descripción", "Monto", "Estado", "Obra"]}
        >
          {movimientos.map((m) => (
            <tr key={m._id}>
              <td>{m.tipo.replaceAll("_", " ")}</td>
              <td>{new Date(m.fecha).toLocaleDateString()}</td>
              <td>{m.descripcion || "-"}</td>
              <td>${m.monto?.toFixed(2)}</td>
              <td>{renderEstado(m.tipo)}</td>
              <td>
                {m.partidasObra?.length > 0 ? (
                  m.partidasObra.map((p, i) => (
                    <div key={i}>
                      {p.obra?.nombre || p.obra} (${p.monto})
                    </div>
                  ))
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}

      <div style={{ marginTop: "1rem", textAlign: "right" }}>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </ModalBase>
  );
}
