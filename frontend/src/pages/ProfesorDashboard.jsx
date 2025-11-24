import { useEffect, useState } from "react";
import api from "../api";

export default function ProfesorDashboard() {
  const [user, setUser] = useState(null);
  const [clave, setClave] = useState("");
  const [uea, setUea] = useState(null);
  const [carta, setCarta] = useState({
    descripcion: "",
    contenido_sintetico: "",
    modalidad_conduccion: "",
    modalidad_evaluacion: "",
    conocimientos_previos: "",
    asesorias: "",
    bibliografia: "",
    calendarizacion: "",
    uea: null,
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const buscarUEA = async () => {
    try {
      const res = await api.get(`academics/public/ueas/`, {
        params: { trimestre: null, licenciatura_id: null, clave },
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGuardarCarta = async () => {
    if (!uea) {
      setMensaje("Primero selecciona una UEA válida.");
      return;
    }
    try {
      const payload = { ...carta, uea: uea.id };
      const res = await api.post("academics/profesor/cartas/", payload);
      setMensaje("Carta temática guardada. No olvides marcarla como completada cuando esté lista.");
    } catch (err) {
      console.error(err);
      setMensaje("Error al guardar la carta temática.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Panel del Profesor</h2>
      {user && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="font-semibold mb-1">Datos del usuario</h3>
          <p className="text-sm">Usuario: {user.username}</p>
          <p className="text-sm">Rol: {user.role}</p>
        </div>
      )}

      <section className="bg-white rounded-lg shadow p-4 space-y-4">
        <h3 className="font-semibold text-lg mb-2">1. Seleccionar UEA</h3>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Clave de UEA</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Ej. DCG-101"
            />
          </div>
          <button
            onClick={buscarUEA}
            className="bg-sky-700 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>
        {uea && (
          <div className="mt-2 text-sm">
            <p><span className="font-semibold">UEA:</span> {uea.nombre}</p>
            <p><span className="font-semibold">Trimestre:</span> {uea.trimestre}</p>
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow p-4 space-y-3">
        <h3 className="font-semibold text-lg mb-2">2. Carta Temática</h3>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Descripción"
          value={carta.descripcion}
          onChange={(e) => setCarta({ ...carta, descripcion: e.target.value })}
        />
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Contenido sintético"
          value={carta.contenido_sintetico}
          onChange={(e) => setCarta({ ...carta, contenido_sintetico: e.target.value })}
        />
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Modalidad de conducción"
          value={carta.modalidad_conduccion}
          onChange={(e) => setCarta({ ...carta, modalidad_conduccion: e.target.value })}
        />
        <button
          onClick={handleGuardarCarta}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Guardar carta temática
        </button>
        {mensaje && <p className="text-sm mt-2">{mensaje}</p>}
      </section>
    </div>
  );
}
