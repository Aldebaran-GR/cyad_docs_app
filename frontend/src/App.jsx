import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ProfesorDashboard from "./pages/ProfesorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CartaTematica from "./pages/CartaTematica";
import RequisitosRecuperacion from "./pages/RequisitosRecuperacion";
import CartaTematicaPage from "./pages/CartaTematicaPage";
import RequisitosRecuperacionPage from "./pages/RequisitosRecuperacionPage";
import AutoevaluacionPage from "./pages/AutoevaluacionPage";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/profesor" 
              element={
                <ProtectedRoute allowedRoles={["PROFESOR"]}>
                  <ProfesorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cartaTematica" 
              element={
                <ProtectedRoute allowedRoles={["PROFESOR"]}>
                  <CartaTematicaPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cartaTematica/:operation" 
              element={
                <ProtectedRoute allowedRoles={["PROFESOR"]}>
                  <CartaTematicaPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/requisitosRecuperacion" 
              element={
                <ProtectedRoute allowedRoles={["PROFESOR"]}>
                  <RequisitosRecuperacionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/requisitosRecuperacion/:operation" 
              element={
                <ProtectedRoute allowedRoles={["PROFESOR"]}>
                  <RequisitosRecuperacionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/autoevaluacion" 
              element={
                <ProtectedRoute allowedRoles={["PROFESOR"]}>
                  <AutoevaluacionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-2xl font-semibold mb-4">Consulta para alumnos</h2>
                <p className="text-sm text-gray-700 mb-4">
                  Selecciona el documento que deseas consultar:
                </p>
                <div className="flex flex-col md:flex-row gap-6">
                  <a href="/carta-tematica" className="block border border-sky-700 rounded-lg px-6 py-4 text-center text-sky-900 font-semibold text-lg hover:bg-sky-50 transition">
                    Carta Temática
                  </a>
                  <a href="/requisitos-recuperacion" className="block border border-sky-700 rounded-lg px-6 py-4 text-center text-sky-900 font-semibold text-lg hover:bg-sky-50 transition">
                    Requisitos de recuperación
                  </a>
                </div>
              </div>
            } />
            <Route path="/carta-tematica" element={<CartaTematica />} />
            <Route path="/requisitos-recuperacion" element={<RequisitosRecuperacion />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
