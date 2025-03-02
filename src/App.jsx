import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ObrasList from "./pages/ObrasList.jsx";
import ObraDetail from "./pages/ObraDetail.jsx";
import ProveedoresList from "./pages/ProveedoresList.jsx";
import Compras from "./pages/Compras.jsx";
import Panol from "./pages/Panol.jsx";
import Calendario from "./pages/Calendario.jsx";
import Configuracion from "./pages/Configuracion.jsx";
import Reportes from "./pages/Reportes.jsx";
import About from "./pages/About.jsx";
import Planner from "./pages/Planner.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Mediciones from "./pages/Mediciones.jsx";

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      {user && <Sidebar />}
      <div className={`main-content ${user ? "with-sidebar" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/obras/:id" element={<ProtectedRoute><ObraDetail /></ProtectedRoute>} />
          <Route path="/obras" element={<ProtectedRoute><ObrasList /></ProtectedRoute>} />
          <Route path="/proveedores" element={<ProtectedRoute><ProveedoresList /></ProtectedRoute>} />
          <Route path="/panol" element={<ProtectedRoute><Panol /></ProtectedRoute>} />
          <Route path="/calendario" element={<ProtectedRoute><Calendario /></ProtectedRoute>} />
          <Route path="/mediciones" element={<ProtectedRoute><Mediciones /></ProtectedRoute>} />
          <Route path="/compras" element={<ProtectedRoute><Compras /></ProtectedRoute>} />
          <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
          <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
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
