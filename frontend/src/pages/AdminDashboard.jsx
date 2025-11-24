import { useEffect, useState } from "react";
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
      <h2 className="text-2xl font-semibold mb-4">Dashboard Administrador</h2>
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
