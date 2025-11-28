
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import ProfesorDashboard from "./pages/ProfesorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CartaTematica from "./pages/CartaTematica";
import RequisitosRecuperacion from "./pages/RequisitosRecuperacion";


export default function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-sky-900 text-white px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">CyAD · Gestión de Documentos</Link>
        <button
          className="bg-white text-sky-900 font-semibold px-4 py-1 rounded shadow hover:bg-sky-100 transition"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </header>
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profesor" element={<ProfesorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
  );
}
