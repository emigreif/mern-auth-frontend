import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/GlobalStylePages.module.css";
import Table from "../components/ui/Table.jsx";
import Button from "../components/ui/Button.jsx";
import ModalBase from "../components/modals/ModalBase.jsx";
import ModalNuevoEmpleado from "../components/modals/ModalNuevoEmpleado.jsx";

const Nomina = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [showNuevoModal, setShowNuevoModal] = useState(false);
  const [editandoEmpleado, setEditandoEmpleado] = useState(null);

  const [showAumentoModal, setShowAumentoModal] = useState(false);
  const [aumentoEmpleado, setAumentoEmpleado] = useState(null);
  const [aumentoData, setAumentoData] = useState({ aplicarA: "ambos", tipo: "porcentaje", valor: 0 });

  const [editSueldo, setEditSueldo] = useState(null);
  const [editSueldoData, setEditSueldoData] = useState({ salarioRegistrado: 0, salarioNoRegistrado: 0 });

  useEffect(() => {
    if (token) fetchEmpleados();
  }, [token]);

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/employee`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEmpleados(Array.isArray(data) ? data : []);
    } catch {
      setErrorMsg("Error al obtener empleados");
    } finally {
      setLoading(false);
    }
  };

  const ordenarPor = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sorted = [...empleados].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = (a[sortConfig.key] ?? "").toString().toLowerCase();
    const valB = (b[sortConfig.key] ?? "").toString().toLowerCase();
    return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const handleAumento = async () => {
    const endpoint = aumentoEmpleado
      ? `${API_URL}/api/employee/${aumentoEmpleado._id}/aumento`
      : `${API_URL}/api/employee/aumentos/masivo`;

    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(aumentoData)
    });

    if (res.ok) {
      fetchEmpleados();
      setShowAumentoModal(false);
      setAumentoEmpleado(null);
    }
  };

  const handleEditSueldo = async () => {
    const res = await fetch(`${API_URL}/api/employee/sueldo/${editSueldo._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editSueldoData)
    });

    if (res.ok) {
      fetchEmpleados();
      setEditSueldo(null);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar empleado?")) return;
    await fetch(`${API_URL}/api/employee/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchEmpleados();
  };

  const toggleActivo = async (emp) => {
    await fetch(`${API_URL}/api/employee/${emp._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...emp, activo: !emp.activo })
    });
    fetchEmpleados();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Nómina</h1>
        <Button onClick={() => setShowNuevoModal(true)}>➕ Nuevo</Button>
        <Button onClick={() => { setShowAumentoModal(true); setAumentoEmpleado(null); }}>📈 Aumento General</Button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table
          headers={[
            { key: "apellido", label: "Apellido" },
            { key: "nombre", label: "Nombre" },
            { key: "puesto", label: "Puesto" },
            { key: "salario", label: "Total $" },
            { key: "blanco", label: "Registrado $" },
            { key: "negro", label: "No Reg. $" },
            { key: "activo", label: "Activo" },
            { key: "acciones", label: "Acciones" },
          ]}
          onSort={ordenarPor}
          sortConfig={sortConfig}
        >
          {sorted.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.apellido}</td>
              <td>{emp.nombre}</td>
              <td>{emp.puesto}</td>
              <td>${emp.salario?.toFixed(2)}</td>
              <td>${emp.salarioRegistrado?.toFixed(2)}</td>
              <td>${emp.salarioNoRegistrado?.toFixed(2)}</td>
              <td>{emp.activo ? "✅" : "❌"}</td>
              <td>
                <Button onClick={() => { setEditSueldo(emp); setEditSueldoData({ salarioRegistrado: emp.salarioRegistrado, salarioNoRegistrado: emp.salarioNoRegistrado }); }}>💰 Sueldo</Button>
                <Button onClick={() => { setAumentoEmpleado(emp); setShowAumentoModal(true); }}>📈 Aumento</Button>
                <Button onClick={() => setEditandoEmpleado(emp)}>✏️ Editar</Button>
                <Button onClick={() => toggleActivo(emp)}>🔁 Activo</Button>
                <Button variant="danger" onClick={() => handleEliminar(emp._id)}>🗑️</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Modal NUEVO o EDITAR EMPLEADO */}
      {showNuevoModal || editandoEmpleado ? (
        <ModalBase
          isOpen={true}
          title={editandoEmpleado ? "Editar Empleado" : "Nuevo Empleado"}
          onClose={() => { setEditandoEmpleado(null); setShowNuevoModal(false); }}
        >
          <ModalNuevoEmpleado
            empleado={editandoEmpleado}
            onCreated={() => {
              setEditandoEmpleado(null);
              setShowNuevoModal(false);
              fetchEmpleados();
            }}
            onClose={() => {
              setEditandoEmpleado(null);
              setShowNuevoModal(false);
            }}
          />
        </ModalBase>
      ) : null}

      {/* Modal AUMENTO */}
      {showAumentoModal && (
        <ModalBase
          isOpen={true}
          onClose={() => { setShowAumentoModal(false); setAumentoEmpleado(null); }}
          title={`Aumento ${aumentoEmpleado ? "Empleado" : "General"}`}
        >
          <div >
            <label>Aplicar a:</label>
            <select value={aumentoData.aplicarA} onChange={(e) => setAumentoData({ ...aumentoData, aplicarA: e.target.value })}>
              <option value="blanco">Registrado</option>
              <option value="negro">No Registrado</option>
              <option value="ambos">Ambos</option>
            </select>

            <label>Tipo:</label>
            <select value={aumentoData.tipo} onChange={(e) => setAumentoData({ ...aumentoData, tipo: e.target.value })}>
              <option value="porcentaje">Porcentaje %</option>
              <option value="monto">Monto Fijo</option>
            </select>

            <label>Valor:</label>
            <input
              type="number"
              value={aumentoData.valor}
              onChange={(e) => setAumentoData({ ...aumentoData, valor: parseFloat(e.target.value) || 0 })}
            />

            <div >
              <Button onClick={handleAumento}>Aplicar</Button>
              <Button variant="secondary" onClick={() => setShowAumentoModal(false)}>Cancelar</Button>
            </div>
          </div>
        </ModalBase>
      )}

      {/* Modal SUELDO EDITAR */}
      {editSueldo && (
        <ModalBase
          isOpen={true}
          title="Editar Sueldo"
          onClose={() => setEditSueldo(null)}
        >
          <div>
            <label>Registrado (blanco):</label>
            <input
              type="number"
              value={editSueldoData.salarioRegistrado}
              onChange={(e) => {
                const blanco = parseFloat(e.target.value) || 0;
                setEditSueldoData((prev) => ({
                  ...prev,
                  salarioRegistrado: blanco,
                  salarioNoRegistrado: editSueldo.salario - blanco
                }));
              }}
            />
            <label>No registrado (negro):</label>
            <input
              type="number"
              value={editSueldoData.salarioNoRegistrado}
              onChange={(e) => {
                const negro = parseFloat(e.target.value) || 0;
                setEditSueldoData((prev) => ({
                  ...prev,
                  salarioNoRegistrado: negro,
                  salarioRegistrado: editSueldo.salario - negro
                }));
              }}
            />
            <div >
              <Button onClick={handleEditSueldo}>Guardar</Button>
              <Button variant="secondary" onClick={() => setEditSueldo(null)}>Cancelar</Button>
            </div>
          </div>
        </ModalBase>
      )}
    </div>
  );
};

export default Nomina;
