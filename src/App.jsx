// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

// Páginas públicas
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Planner from "./pages/Planner.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import BaseMateriales from "./pages/BaseMateriales.jsx"; // 🔹 Ahora está en rutas protegidas

// Páginas protegidas
import Obras from "./pages/Obras.jsx";
import Presupuestos from "./pages/Presupuestos.jsx";
import Proveedores from "./pages/Proveedores.jsx";
import Panol from "./pages/Panol.jsx";
import Calendario from "./pages/Calendario.jsx";
import Mediciones from "./pages/Mediciones.jsx";
import Compras from "./pages/Compras.jsx";
import Contabilidad from "./pages/Contabilidad.jsx"; // con <Outlet />
import Nomina from "./pages/Nomina.jsx";
import Configuracion from "./pages/Configuracion.jsx"; // con <Outlet />
import Profile from "./pages/Profile.jsx";
import Perfiles from "./pages/Perfiles.jsx";
import Reportes from "./pages/Reportes.jsx";

// Componentes globales
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

// 1. Rutas públicas
function PublicRoutes() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/base-materiales" element={<BaseMateriales />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

// 2. Rutas protegidas
function ProtectedRoutes() {
  const [sidebarExpanded, setSidebarExpanded] = React.useState(false);

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <div
        className={`main-content ${
          sidebarExpanded ? "with-sidebar-expanded" : "with-sidebar-collapsed"
        }`}
      >
        <Routes>
          <Route path="/obras" element={<Obras />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/panol" element={<Panol />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/mediciones" element={<Mediciones />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/contabilidad" element={<Contabilidad />} />
          <Route path="/nomina" element={<Nomina />} />

          <Route path="/configuracion" element={<Configuracion />}>
            <Route path="profile" element={<Profile />} />
            <Route path="perfiles" element={<Perfiles />} />
          </Route>
          <Route path="*" element={<Navigate to="/obras" />} />
        </Routes>
      </div>
    </div>
  );
}

// Decide si renderizar rutas públicas o protegidas
function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</div>
    );
  }

  return user ? <ProtectedRoutes /> : <PublicRoutes />;
}

// 3. Componente principal
export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
