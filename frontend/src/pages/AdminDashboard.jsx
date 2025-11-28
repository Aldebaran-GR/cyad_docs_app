import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import api from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("academics/admin/dashboard/");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-2xl font-semibold">Dashboard Administrador</h2>
        <LogoutButton className="mt-4 md:mt-0 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold" />
      </div>
      {stats ? (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500">Profesores registrados</p>
            <p className="text-2xl font-bold">{stats.total_profesores}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500">Cartas temáticas completas</p>
            <p className="text-2xl font-bold">{stats.cartas_completadas}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500">Recuperaciones completas</p>
            <p className="text-2xl font-bold">{stats.recuperaciones_completadas}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500">Autoevaluaciones completas</p>
            <p className="text-2xl font-bold">{stats.autoevaluaciones_completadas}</p>
          </div>
        </div>
      ) : (
        <p>Cargando estadísticas...</p>
      )}
    </div>
  );
}
