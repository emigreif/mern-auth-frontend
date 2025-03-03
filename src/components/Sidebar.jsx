import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaBuilding, FaTruck, FaClipboardList, FaCalendarAlt, FaChartBar, 
  FaCog, FaSignOutAlt, FaBars
} from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ onLogout }) => {
  // Estado para saber si está expandido o no
  const [isExpanded, setIsExpanded] = useState(() => {
    return localStorage.getItem("SidebarMode") === "expanded";
  });

  // Estado para expandir con hover si la opción está activada
  const [hoverExpand, setHoverExpand] = useState(false);
  const [expandOnHover, setExpandOnHover] = useState(() => {
    return localStorage.getItem("expandOnHover") === "true";
  });

  useEffect(() => {
    localStorage.setItem("SidebarMode", isExpanded ? "expanded" : "collapsed");
  }, [isExpanded]);

  useEffect(() => {
    localStorage.setItem("expandOnHover", expandOnHover);
  }, [expandOnHover]);

  return (
    <div
      className={`sidebar ${isExpanded || hoverExpand ? "expanded" : "collapsed"}`}
      onMouseEnter={() => expandOnHover && setHoverExpand(true)}
      onMouseLeave={() => expandOnHover && setHoverExpand(false)}
    >
      {/* Botón de menú */}
      <div className="sidebar-header">
        <button className="menu-btn" onClick={() => setIsExpanded(!isExpanded)}>
          <FaBars />
        </button>
      </div>

      {/* Menú de navegación */}
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
          <FaTruck className="icon" />
          <span className="text">Proveedores</span>
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
      </nav>

      {/* Botón de cerrar sesión */}
      <button className="sidebar-item logout" onClick={onLogout}>
        <FaSignOutAlt className="icon" />
        <span className="text">Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;
