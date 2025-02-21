import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ObrasList from "./pages/Obras/ObrasList.jsx";
import ObraDetail from "./pages/Obras/ObraDetail.jsx";
import ProveedoresList from "./pages/Proveedores/ProveedoresList.jsx";
import Panol from "./pages/Panol/Panol.jsx";
import Calendario from "./pages/Calendario/Calendario.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Reportes from "./pages/Reportes/Reportes.jsx";
import About from "./pages/About.jsx"; // Página "About"
import Planner from "./pages/Planner.jsx"; // Página "Planner" (crea este archivo)
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/Planner" element={<Planner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Obras */}
          <Route path="/obras" element={<ObrasList />} />
          <Route path="/obras/:id" element={<ObraDetail />} />

          {/* Proveedores */}
          <Route path="/proveedores" element={<ProveedoresList />} />

          {/* Panol */}
          <Route path="/panol" element={<Panol />} />

          {/* Calendario */}
          <Route path="/calendario" element={<Calendario />} />

          {/* Admin */}
          <Route path="/admin" element={<Admin />} />

          {/* Reportes */}
          <Route path="/reportes" element={<Reportes />} />

          {/* Resto de Rutas (Home, About, Planner, etc.) */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
