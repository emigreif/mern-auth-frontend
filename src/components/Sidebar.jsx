// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faFileInvoiceDollar,
  faUser,
  faShoppingCart,
  faTruck,
  faClipboardList,
  faCalendarAlt,
  faCalculator,
  faChartBar,
  faRulerCombined,
  faCog,
  faUsers,
  faSignOutAlt,
  faUserCog // <-- Se agrega para Perfiles
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext.jsx";

const Sidebar = () => {
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState(true);

  // Maneja la expansión/colapso
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    await logout();
  };

  // Array con todos los enlaces de la sidebar
  const menuItems = [
    { name: "Clientes", route: "/clientes", icon: faUser },
    { name: "Presupuestos", route: "/presupuestos", icon: faFileInvoiceDollar },
    { name: "Obras", route: "/obras", icon: faBuilding },
    { name: "Proveedores", route: "/proveedores", icon: faTruck },
    { name: "Compras", route: "/compras", icon: faShoppingCart },
    { name: "Pañol", route: "/panol", icon: faClipboardList },
    { name: "Calendario", route: "/calendario", icon: faCalendarAlt },
    { name: "Contabilidad", route: "/contabilidad", icon: faCalculator },
    { name: "Mediciones", route: "/mediciones", icon: faRulerCombined },
    { name: "Nómina", route: "/nomina", icon: faUsers },
    { name: "Reportes", route: "/reportes", icon: faChartBar },
    { name: "Configuración", route: "/configuracion", icon: faCog },
    // Nuevo enlace para la pantalla de Perfiles
    { name: "Perfiles", route: "/perfiles", icon: faUserCog },

    { name: "Mi Perfil", route: "/profile", icon: faUser },
  ];

  return (
    <div className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      {/* Encabezado de la sidebar con el botón de colapsar */}
      <div className="sidebar-header">
        <button className="menu-btn" onClick={toggleSidebar}>
          {expanded ? "<" : ">"}
        </button>
      </div>

      {/* Menú principal */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link to={item.route} key={item.name} className="sidebar-item">
            <FontAwesomeIcon icon={item.icon} className="icon" />
            <span className="text">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Botón de logout al final */}
      <button className="sidebar-item logout" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
        <span className="text">Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;
