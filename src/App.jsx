// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Páginas públicas
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Planner from "./pages/Planner.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

// Páginas protegidas
import Obras from "./pages/Obras.jsx";
import Presupuestos from "./pages/Presupuestos.jsx";
import Contabilidad from "./pages/Contabilidad.jsx";
import Clientes from "./pages/Clientes.jsx";
import Proveedores from "./pages/Proveedores.jsx";
import Panol from "./pages/Panol.jsx";
import Calendario from "./pages/Calendario.jsx";
import Mediciones from "./pages/Mediciones.jsx";
import Nomina from "./pages/Nomina.jsx";
import Compras from "./pages/Compras.jsx";
import Configuracion from "./pages/Configuracion.jsx";
import Reportes from "./pages/Reportes.jsx";
import Profile from "./pages/Profile.jsx";

// Componentes globales
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

// Context para saber si hay usuario logueado
import { useAuth } from "./context/AuthContext.jsx";

const PublicRoutes = () => (
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

        {/* Cualquier otra ruta no definida → vuelve a Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  </div>
);

const ProtectedRoutes = () => (
  <div className="app-container">
    {/* Navbar arriba, Sidebar a la izquierda */}
    <Navbar />
    <Sidebar />
    <div className="main-content with-sidebar">
      <Routes>
        {/* Rutas protegidas */}
        <Route path="/obras" element={<Obras />} />
        <Route path="/presupuestos" element={<Presupuestos />} />
        <Route path="/contabilidad" element={<Contabilidad />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/panol" element={<Panol />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/mediciones" element={<Mediciones />} />
        <Route path="/nomina" element={<Nomina />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/profile" element={<Profile />} />

        {/* Cualquier otra ruta no definida → redirige a /obras */}
        <Route path="*" element={<Navigate to="/obras" />} />
      </Routes>
    </div>
  </div>
);

// Decide si renderizar rutas públicas o protegidas
const AppLayout = () => {
  const { user, loading } = useAuth();

  // Mientras "loading" sea true, mostramos un spinner o "Cargando..."
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</div>;
  }

  // Si hay user → ProtectedRoutes, sino → PublicRoutes
  return user ? <ProtectedRoutes /> : <PublicRoutes />;
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
