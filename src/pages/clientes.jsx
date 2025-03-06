import React, { useState, useEffect } from "react";
import ClienteModal from "../components/ClienteModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleClienteCreado = (nuevoCliente) => {
        setClientes([...clientes, nuevoCliente]);
    };

    return (

        <div className="page-background">
            <div className="page-contenedor">
                <h1>Clientes</h1>
                <button onClick={() => setIsModalOpen(true)}>Agregar Cliente</button>

                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente._id}>
                                <td>{cliente.nombre} {cliente.apellido}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.telefono}</td>
                                <td>{cliente.direccion.calle}, {cliente.direccion.ciudad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ClienteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onClienteCreado={handleClienteCreado} />
            </div>
        </div>
    );
};

export default Clientes;
