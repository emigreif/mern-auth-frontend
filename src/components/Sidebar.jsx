// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faFileInvoiceDollar,
  faUsers,
  faShoppingCart,
  faTruck,
  faClipboardList,
  faCalendarAlt,
  faCalculator,
  faChartBar,
  faRulerCombined,
  faCog,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext.jsx";

import styles from "../styles/components/sidebar.module.css"; // ✅ CSS modular

const Sidebar = ({ expanded, setExpanded }) => {
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { name: "Obras", route: "/obras", icon: faBuilding },
    { name: "Presupuestos", route: "/presupuestos", icon: faFileInvoiceDollar },
    { name: "Proveedores", route: "/proveedores", icon: faTruck },
    { name: "Compras", route: "/compras", icon: faShoppingCart },
    { name: "Pañol", route: "/panol", icon: faClipboardList },
    { name: "Calendario", route: "/calendario", icon: faCalendarAlt },
    { name: "Contabilidad", route: "/contabilidad", icon: faCalculator },
    { name: "Mediciones", route: "/mediciones", icon: faRulerCombined },
    { name: "Nomina", route: "/Nomina", icon: faUsers },
    { name: "Reportes", route: "/reportes", icon: faChartBar },
    { name: "Configuración", route: "/configuracion", icon: faCog }
  ];

  return (
    <div
      className={`${styles.sidebar} ${
        expanded ? styles.expanded : styles.collapsed
      }`}
    >
      <div className={styles["sidebar-header"]}>
        <button className={styles["menu-btn"]} onClick={toggleSidebar}>
          {expanded ? "<" : ">"}
        </button>
      </div>

      <nav className={styles["sidebar-menu"]}>
        {menuItems.map((item) => (
          <Link to={item.route} key={item.name} className={styles["sidebar-item"]}>
            <FontAwesomeIcon icon={item.icon} className={styles.icon} />
            {expanded && <span className={styles.text}>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <button className={`${styles["sidebar-item"]} ${styles.logout}`} onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
        {expanded && <span className={styles.text}>Cerrar Sesión</span>}
      </button>
    </div>
  );
};

export default Sidebar;
