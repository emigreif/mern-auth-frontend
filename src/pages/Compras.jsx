import React, { useState, useEffect } from "react";
import "../styles/Compras.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit, faTrash, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoCompra, setTipoCompra] = useState("perfiles");
  const [proveedor, setProveedor] = useState("");
  const [lugarEntrega, setLugarEntrega] = useState("");
  const [pedido, setPedido] = useState([]);
  
  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    const response = await fetch("http://localhost:5000/api/compras");
    const data = await response.json();
    setCompras(data);
  };

  const agregarMaterial = () => {
    const nuevoItem = tipoCompra === "vidrios"
      ? { composicion: "", cantidad: "", ancho: "", alto: "", tipologia: "", observaciones: "" }
      : tipoCompra === "perfiles"
      ? { codigo: "", descripcion: "", cantidad: "", tratamiento: "", largo: "", observaciones: "" }
      : { codigo: "", descripcion: "", color: "", cantidad: "", unidad: "unidades", observaciones: "" };
    setPedido([...pedido, nuevoItem]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setPedido(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const getEstadoClase = (compra) => {
    if (compra.estado === "recibido") return "estado-verde";
    if (compra.estado === "vencido") return "estado-rojo";
    if (compra.estado === "parcial" || compra.estado === "proximo") return "estado-naranja";
    return "";
  };

  return (
    <div className="compras-container">
      <h1>Portal de Compras</h1>
      <button onClick={() => { setShowModal(true); setTipoCompra("perfiles"); }}>Nueva Compra</button>
      <table className="compras-table">
        <thead>
          <tr>
            <th>N° Compra</th>
            <th>Obra</th>
            <th>Proveedor</th>
            <th>Tipo</th>
            <th>Fecha Compra</th>
            <th>Fecha Esperada</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id} className={getEstadoClase(compra)}>
              <td>{compra.numero}</td>
              <td>{compra.obra}</td>
              <td>{compra.proveedor}</td>
              <td>{compra.tipo}</td>
              <td>{compra.fechaCompra}</td>
              <td>{compra.fechaEsperada}</td>
              <td>{compra.estado}</td>
              <td>
                <button><FontAwesomeIcon icon={faEdit} /></button>
                <button><FontAwesomeIcon icon={faTrash} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal-background">
          <div className="modal-container">
            <h2>Nueva Compra de {tipoCompra}</h2>
            <label>Proveedor:</label>
            <input type="text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} />
            <label>Lugar de Entrega:</label>
            <input type="text" value={lugarEntrega} onChange={(e) => setLugarEntrega(e.target.value)} />
            <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
            <table>
              <thead>
                <tr>
                  {tipoCompra === "perfiles" && <><th>Código</th><th>Descripción</th><th>Cantidad</th><th>Tratamiento</th><th>Largo</th><th>Observaciones</th></>}
                  {tipoCompra === "vidrios" && <><th>Composición</th><th>Cantidad</th><th>Ancho</th><th>Alto</th><th>Tipología</th><th>Observaciones</th></>}
                  {tipoCompra === "accesorios" && <><th>Código</th><th>Descripción</th><th>Color</th><th>Cantidad</th><th>Unidad</th><th>Observaciones</th></>}
                </tr>
              </thead>
              <tbody>
                {pedido.map((item, index) => (
                  <tr key={index}>
                    {Object.keys(item).map((key) => (
                      <td key={key}><input type="text" value={item[key]} onChange={(e) => {
                        let updatedPedido = [...pedido];
                        updatedPedido[index][key] = e.target.value;
                        setPedido(updatedPedido);
                      }} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={agregarMaterial}><FontAwesomeIcon icon={faPlusCircle} /> Agregar Material</button>
            <button onClick={() => setShowModal(false)}>Guardar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compras;
