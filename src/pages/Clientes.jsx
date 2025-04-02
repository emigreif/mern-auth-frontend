import React, { useState, useEffect } from "react";
import styles from "../styles/pages/GlobalStylePages.module.css";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import Table from "../components/ui/Table.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";
import ModalBase from "../components/modals/ModalBase.jsx";

export default function Clientes() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [clientes, setClientes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    if (token) fetchClientes();
  }, [token]);

  const fetchClientes = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/clientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMsg("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (cliente) => {
    setEditingCliente(cliente);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingCliente(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = (reload = false) => {
    setEditingCliente(null);
    setIsModalOpen(false);
    if (reload) fetchClientes();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      const res = await fetch(`${API_URL}/api/clientes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar");
      fetchClientes();
    } catch (error) {
      alert("No se pudo eliminar el cliente.");
    }
  };

  const ordenarPor = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filtered = clientes.filter((cliente) =>
    Object.values({
      ...cliente,
      calle: cliente.direccion?.calle,
      ciudad: cliente.direccion?.ciudad,
    }).some((val) =>
      String(val ?? "").toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const getVal = (obj) => {
      switch (sortConfig.key) {
        case "nombreCompleto":
          return `${obj.nombre || ""} ${obj.apellido || ""}`;
        case "calle":
          return obj.direccion?.calle || "";
        case "ciudad":
          return obj.direccion?.ciudad || "";
        default:
          return obj[sortConfig.key] ?? "";
      }
    };

    const aStr = String(getVal(a)).toLowerCase();
    const bStr = String(getVal(b)).toLowerCase();

    return sortConfig.direction === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Clientes</h1>
        <Button onClick={handleOpenCreate}>+ Agregar Cliente</Button>
      </div>

      <div style={{ marginBottom: 10, maxWidth: 300 }}>
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar clientes..."
        />
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      {loading && <p>Cargando clientes...</p>}

      {!loading && (
        <Table
          headers={[
            { key: "nombreCompleto", label: "Nombre" },
            { key: "email", label: "Email" },
            { key: "telefono", label: "Teléfono" },
            { key: "calle", label: "Calle" },
            { key: "ciudad", label: "Ciudad" },
            { key: "condicionFiscal", label: "Condición Fiscal" },
            { key: "acciones", label: "Acciones" },
          ]}
          onSort={ordenarPor}
          sortConfig={sortConfig}
        >
          {sorted.map((c) => (
            <tr key={c._id}>
              <td>{`${c.nombre || ""} ${c.apellido || ""}`}</td>
              <td>{c.email}</td>
              <td>{c.telefono}</td>
              <td>{c.direccion?.calle}</td>
              <td>{c.direccion?.ciudad}</td>
              <td>{c.condicionFiscal}</td>
              <td>
                <Button onClick={() => handleOpenEdit(c)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(c._id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {isModalOpen && (
        <ModalBase
          isOpen={true}
          onClose={() => handleCloseModal()}
          title={editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
        >
          <ClienteForm
            cliente={editingCliente}
            onSuccess={() => handleCloseModal(true)}
            API_URL={API_URL}
            token={token}
          />
        </ModalBase>
      )}
    </div>
  );
}

function ClienteForm({ cliente, onSuccess, API_URL, token }) {
  const [form, setForm] = useState({
    nombre: cliente?.nombre || "",
    apellido: cliente?.apellido || "",
    email: cliente?.email || "",
    telefono: cliente?.telefono || "",
    calle: cliente?.direccion?.calle || "",
    ciudad: cliente?.direccion?.ciudad || "",
    condicionFiscal: cliente?.condicionFiscal || "Consumidor Final",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const body = {
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      telefono: form.telefono,
      direccion: {
        calle: form.calle,
        ciudad: form.ciudad,
      },
      condicionFiscal: form.condicionFiscal,
    };

    const method = cliente ? "PUT" : "POST";
    const endpoint = cliente ? `/api/clientes/${cliente._id}` : `/api/clientes`;

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      onSuccess();
    } else {
      alert("Error al guardar el cliente");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre *"
      />
      <input
        name="apellido"
        value={form.apellido}
        onChange={handleChange}
        placeholder="Apellido *"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email *"
      />
      <input
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        placeholder="Teléfono"
      />
      <input
        name="calle"
        value={form.calle}
        onChange={handleChange}
        placeholder="Dirección - Calle"
      />
      <input
        name="ciudad"
        value={form.ciudad}
        onChange={handleChange}
        placeholder="Dirección - Ciudad"
      />
      <select
        name="condicionFiscal"
        value={form.condicionFiscal}
        onChange={handleChange}
      >
        <option value="Consumidor Final">Consumidor Final</option>
        <option value="Responsable Inscripto">Responsable Inscripto</option>
        <option value="Monotributo">Monotributo</option>
      </select>
      <Button onClick={handleSubmit}>Guardar</Button>
    </div>
  );
}
