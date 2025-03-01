import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBuilding, FaTruck, FaCog, FaChartBar, FaClipboardList, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(() => {
    return localStorage.getItem("SidebarMode") === "expanded";
  });

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
      className={`Sidebar ${isExpanded || hoverExpand ? "expanded" : "collapsed"}`}
      onMouseEnter={() => expandOnHover && setHoverExpand(true)}
      onMouseLeave={() => expandOnHover && setHoverExpand(false)}
    >
      <div className="Sidebar-header">
        <h3 className="logo">Planner</h3>
      </div>

      <nav className="Sidebar-menu">
       
        <Link to="/obras" className="Sidebar-item">
          <FaBuilding className="icon" />
          <span className="text">Obras</span>
        </Link>
        <Link to="/proveedores" className="Sidebar-item">
          <FaTruck className="icon" />
          <span className="text">Proveedores</span>
        </Link>
        <Link to="/panol" className="Sidebar-item">
          <FaClipboardList className="icon" />
          <span className="text">Pañol</span>
        </Link>
        <Link to="/calendario" className="Sidebar-item">
          <FaCalendarAlt className="icon" />
          <span className="text">Calendario</span>
        </Link>
        <Link to="/reportes" className="Sidebar-item">
          <FaChartBar className="icon" />
          <span className="text">Reportes</span>
        </Link>
        <Link to="/configuracion" className="Sidebar-item">
          <FaCog className="icon" />
          <span className="text">Configuración</span>
        </Link>
        <button className="Sidebar-item logout" onClick={onLogout}>
          <FaSignOutAlt className="icon" />
          <span className="text">Cerrar Sesión</span>
        </button>
      </nav>

      <div className="Sidebar-footer">
        <button onClick={() => setIsExpanded(!isExpanded)} className="toggle-btn">
          {isExpanded ? "❮" : "❯"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
