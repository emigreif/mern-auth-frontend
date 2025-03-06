import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Clientes = ({ onClienteSeleccionado }) => {
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState({
        tipoCliente: "particular",
        nombre: "",
        apellido: "",
        empresa: "",
        email: "",
        telefono: "",
        direccion: { calle: "", ciudad: "" },
        notas: "",
    });

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const res = await fetch(`${API_URL}/api/clientes`, {
                    method: "GET",
                    credentials: "include",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (!res.ok) throw new Error("Error al obtener clientes");
                const data = await res.json();
                setClientes(data);
            } catch (error) {
                console.error("Error cargando clientes:", error);
            }
        };
        obtenerClientes();
    }, []);

    const handleChange = (e) => {
        setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
    };

    const handleSaveCliente = async () => {
        try {
            const res = await fetch(`${API_URL}/api/clientes`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(nuevoCliente),
            });

            if (!res.ok) throw new Error("Error al crear cliente");

            const data = await res.json();
            setClientes([...clientes, data.cliente]);
            setIsModalOpen(false);
            onClienteSeleccionado(data.cliente._id);
        } catch (error) {
            console.error("Error creando cliente:", error);
        }
    };

    return (
        <div className="page-background">
            <div className="page-contenedor">
                <h1>Clientes</h1>
                <button onClick={() => setIsModalOpen(true)}>Agregar Cliente</button>

                <select onChange={(e) => onClienteSeleccionado(e.target.value)}>
                    <option value="">Seleccionar Cliente</option>
                    {clientes.map((c) => (
                        <option key={c._id} value={c._id}>{c.nombre} {c.apellido}</option>
                    ))}
                </select>

                {isModalOpen && (
                    <div className="modal">
                        <h2>Nuevo Cliente</h2>
                        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} />
                        <input type="text" name="email" placeholder="Email" onChange={handleChange} />
                        <button onClick={handleSaveCliente}>Guardar</button>
                        <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                )}
            </div></div>
    );
};

export default Clientes;
