import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfesorDashboard from "./pages/ProfesorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PublicConsulta from "./pages/PublicConsulta";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-sky-900 text-white px-6 py-4 flex justify-between">
        <h1 className="font-bold text-xl">CyAD · Gestión de Documentos</h1>
        <nav className="space-x-4 text-sm">
          <Link to="/" className="hover:underline">Inicio</Link>
          <Link to="/consulta" className="hover:underline">Alumno</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Bienvenida/o</h2>
              <p className="mb-2">
                Este sistema permite a los docentes de la División de CyAD gestionar
                sus cartas temáticas, autoevaluaciones y requisitos de recuperación.
              </p>
              <p>
                Los alumnos pueden consultar la información de recuperación sin necesidad
                de iniciar sesión.
              </p>
            </div>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profesor" element={<ProfesorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/consulta" element={<PublicConsulta />} />
        </Routes>
      </main>
    </div>
  );
}
