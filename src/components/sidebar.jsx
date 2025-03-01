import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBuilding, FaTruck, FaCog, FaChartBar, FaClipboardList, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(() => {
    return localStorage.getItem("sidebarMode") === "expanded";
  });

  const [hoverExpand, setHoverExpand] = useState(false);
  const [expandOnHover, setExpandOnHover] = useState(() => {
    return localStorage.getItem("expandOnHover") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarMode", isExpanded ? "expanded" : "collapsed");
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
      <div className="sidebar-header">
        <h3 className="logo">Planner</h3>
      </div>

      <nav className="sidebar-menu">
        <Link to="/dashboard" className="sidebar-item">
          <FaHome className="icon" />
          <span className="text">Dashboard</span>
        </Link>
        <Link to="/obras" className="sidebar-item">
          <FaBuilding className="icon" />
          <span className="text">Obras</span>
        </Link>
        <Link to="/proveedores" className="sidebar-item">
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
        <button className="sidebar-item logout" onClick={onLogout}>
          <FaSignOutAlt className="icon" />
          <span className="text">Cerrar Sesión</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => setIsExpanded(!isExpanded)} className="toggle-btn">
          {isExpanded ? "❮" : "❯"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
