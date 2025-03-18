// src/components/Sidebar/Sidebar.jsx
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
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext.jsx";


const Sidebar = () => {
  const { logout } = useAuth();
  // Arranca colapsada:
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Menú
  const menuItems = [
    { name: "Obras", route: "/obras", icon: faBuilding },
    { name: "Presupuestos", route: "/presupuestos", icon: faFileInvoiceDollar },
    { name: "Proveedores", route: "/proveedores", icon: faTruck },
    { name: "Compras", route: "/compras", icon: faShoppingCart },
    { name: "Pañol", route: "/panol", icon: faClipboardList },
    { name: "Calendario", route: "/calendario", icon: faCalendarAlt },
    { name: "Contabilidad", route: "/contabilidad", icon: faCalculator },
    { name: "Mediciones", route: "/mediciones", icon: faRulerCombined },
    { name: "Reportes", route: "/reportes", icon: faChartBar },
    // Configuración => sub-rutas /configuracion
    { name: "Configuración", route: "/configuracion", icon: faCog }
  ];

  return (
    <div className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        <button className="menu-btn" onClick={toggleSidebar}>
          {expanded ? "<" : ">"}
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link to={item.route} key={item.name} className="sidebar-item">
            <FontAwesomeIcon icon={item.icon} className="icon" />
            {expanded && <span className="text">{item.name}</span>}
          </Link>
        ))}
      </nav>

      <button className="sidebar-item logout" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
        {expanded && <span className="text">Cerrar Sesión</span>}
      </button>
    </div>
  );
};

export default Sidebar;
