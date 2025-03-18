// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

// Páginas públicas
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import Planner from "./pages/Planner/Planner.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";

// Páginas protegidas
import Obras from "./pages/Obras/Obras.jsx";
import Presupuestos from "./pages/Presupuestos/Presupuestos.jsx";
import Proveedores from "./pages/Proveedores/Proveedores.jsx";
import Panol from "./pages/Panol/Panol.jsx";
import Calendario from "./pages/Calendario/Calendario.jsx";
import Mediciones from "./pages/Mediciones/Mediciones.jsx";
import Compras from "./pages/Compras/Compras.jsx";
import Contabilidad from "./pages/Contabilidad/Contabilidad.jsx"; // con <Outlet />
import Nomina from "./pages/Nomina/Nomina.jsx";
import Configuracion from "./pages/Configuracion/Configuracion.jsx"; // con <Outlet />
import Profile from "./pages/Profile/Profile.jsx";
import Perfiles from "./pages/Perfiles/Perfiles.jsx";
import Reportes from "./pages/Reportes/Reportes.jsx";

// Componentes globales
import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";

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

          {/* Si no hay coincidencia, volver a Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

// 2. Rutas protegidas
function ProtectedRoutes() {
  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content with-sidebar">
        <Routes>
          {/* Ejemplos de rutas principales */}
          <Route path="/obras" element={<Obras />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/panol" element={<Panol />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/mediciones" element={<Mediciones />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/reportes" element={<Reportes />} />

          {/* Ruta padre: /contabilidad */}
          <Route path="/contabilidad" element={<Contabilidad />}>
            {/* Sub-ruta => /contabilidad/nomina */}
            <Route path="nomina" element={<Nomina />} />
          </Route>

          {/* Ruta padre: /configuracion */}
          <Route path="/configuracion" element={<Configuracion />}>
            {/* Sub-rutas => /configuracion/profile y /configuracion/perfiles */}
            <Route path="profile" element={<Profile />} />
            <Route path="perfiles" element={<Perfiles />} />
          </Route>

          {/* Si no coincide => redirigir a /obras */}
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
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</div>;
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
