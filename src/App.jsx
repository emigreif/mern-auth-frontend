import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ObrasList from "./pages/ObrasList.jsx";
import ObraDetail from "./pages/ObraDetail.jsx";
import ProveedoresList from "./pages/ProveedoresList.jsx";

import Panol from "./pages/Panol.jsx";
import Calendario from "./pages/Calendario.jsx";
import Admin from "./pages/Admin.jsx";
import Reportes from "./pages/Reportes.jsx";
import About from "./pages/About.jsx"; // Página "About"
import Planner from "./pages/Planner.jsx"; // Página "Planner" (crea este archivo)
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Importa el componente

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
          <Route path="/obras/:id" element={<ObraDetail />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/obras" element={<ProtectedRoute><ObrasList /></ProtectedRoute>} />
          <Route path="/proveedores" element={<ProtectedRoute><ProveedoresList /></ProtectedRoute>} />
          <Route path="/panol" element={<ProtectedRoute><Panol /></ProtectedRoute>} />
          <Route path="/calendario" element={<ProtectedRoute><Calendario /></ProtectedRoute>} />
          
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
