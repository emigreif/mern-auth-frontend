import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Planner from "./pages/Planner.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ObrasList from "./pages/ObrasList.jsx";
import ObraDetail from "./pages/ObraDetail.jsx";
import Presupuestos from "./pages/Presupuestos.jsx";
import Contabilidad from "./pages/Contabilidad.jsx";
import Clientes from "./pages/Clientes.jsx";
import ProveedoresList from "./pages/ProveedoresList.jsx";
import Panol from "./pages/Panol.jsx";
import Calendario from "./pages/Calendario.jsx";
import Mediciones from "./pages/MedicionesDashboard.jsx";
import MedicionesPage from "./pages/MedicionesPage.jsx";
import Compras from "./pages/Compras.jsx";
import Configuracion from "./pages/Configuracion.jsx";
import Profile from "./pages/Profile.jsx";
import Reportes from "./pages/Reportes.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

const PublicRoutes = () => (
  <div className="app-container">
    <Navbar />
    <div className="main-content">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/planner" element={<Planner />} />
        {/* Redirige a la home si se ingresa una ruta desconocida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  </div>
);

const ProtectedRoutes = () => (
  <div className="app-container">
    <Navbar />
    <Sidebar />
    <div className="main-content with-sidebar">
      <Routes>
        <Route path="/obras" element={<ObrasList />} />
        <Route path="/obras/:id" element={<ObraDetail />} />
        <Route path="/presupuestos" element={<Presupuestos />} />
        <Route path="/contabilidad" element={<Contabilidad />} />
        <Route path="/proveedores" element={<ProveedoresList />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/panol" element={<Panol />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/mediciones" element={<Mediciones />} />
        <Route path="/mediciones/:id" element={<MedicionesPage />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  </div>
);

const AppLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si el usuario está autenticado se muestran las rutas protegidas;
  // de lo contrario, las rutas públicas (login, register).
  return user ? <ProtectedRoutes /> : <PublicRoutes />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;
