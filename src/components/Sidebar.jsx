// frontend/src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaTruck,
  FaClipboardList,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart,
  FaFileInvoiceDollar, // para "Presupuestos"
  FaCalculator         // para "Contabilidad"
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  // Manejar clic en el botón
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const onLogout = () => {
    logout();
  };

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        {/* Reemplazamos el ícono hamburguesa con > y < */}
        <button className="menu-btn" onClick={toggleSidebar}>
          {isExpanded ? "<" : ">"}
        </button>
      </div>

      <nav className="sidebar-menu">
        <Link to="/obras" className="sidebar-item">
          <FaBuilding className="icon" />
          <span className="text">Obras</span>
        </Link>

        <Link to="/proveedores" className="sidebar-item">
          <FaTruck className="icon" />
          <span className="text">Proveedores</span>
        </Link>

        <Link to="/compras" className="sidebar-item">
          <FaShoppingCart className="icon" />
          <span className="text">Compras</span>
        </Link>

        <Link to="/panol" className="sidebar-item">
          <FaClipboardList className="icon" />
          <span className="text">Pañol</span>
        </Link>

        <Link to="/calendario" className="sidebar-item">
          <FaCalendarAlt className="icon" />
          <span className="text">Calendario</span>
        </Link>

        <Link to="/reportes" className="sidebar-item">
          <FaChartBar className="icon" />
          <span className="text">Reportes</span>
        </Link>

        <Link to="/configuracion" className="sidebar-item">
          <FaCog className="icon" />
          <span className="text">Configuración</span>
        </Link>

        {/* Nuevas rutas */}
        <Link to="/presupuestos" className="sidebar-item">
          <FaFileInvoiceDollar className="icon" />
          <span className="text">Presupuestos</span>
        </Link>

        <Link to="/contabilidad" className="sidebar-item">
          <FaCalculator className="icon" />
          <span className="text">Contabilidad</span>
        </Link>
      </nav>

      <button className="sidebar-item logout" onClick={onLogout}>
        <FaSignOutAlt className="icon" />
        <span className="text">Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;
