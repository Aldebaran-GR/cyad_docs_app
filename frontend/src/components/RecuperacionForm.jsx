import { useState, useEffect } from "react";
import api from "../api";

export default function RecuperacionForm({ onVolver, onMensaje }) {
  const [ueas, setUeas] = useState([]);
  const [ueaSeleccionada, setUeaSeleccionada] = useState("");
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para Requisitos de Recuperación
  const [recuperacion, setRecuperacion] = useState({
    duracion: "",
    material: "",
    notas: "",
    requisitos: "",
    espacio: "",
  });

  useEffect(() => {
    cargarUEAsProfesor();
    cargarEspacios();
  }, []);

  const cargarUEAsProfesor = async () => {
    try {
      const res = await api.get("academics/profesor/mis-ueas/");
      setUeas(res.data);
    } catch (err) {
      console.error("Error cargando UEAs:", err);
      onMensaje("Error al cargar tus UEAs. Verifica que tienes UEAs asignadas.");
    }
  };

  const cargarEspacios = async () => {
    try {
      const res = await api.get("academics/public/espacios/");
      setEspacios(res.data);
    } catch (err) {
      console.error("Error cargando espacios:", err);
    }
  };

  const handleGuardarRecuperacion = async () => {
    if (!ueaSeleccionada) {
      onMensaje("Selecciona una UEA antes de guardar.");
      return;
    }
    setLoading(true);
    onMensaje("");
    try {
      const payload = { ...recuperacion, uea: ueaSeleccionada };
      await api.post("academics/profesor/recuperaciones/", payload);
      onMensaje("✓ Requisitos de recuperación guardados exitosamente.");
      // Limpiar formulario
      setRecuperacion({
        duracion: "",
        material: "",
        notas: "",
        requisitos: "",
        espacio: "",
      });
      setUeaSeleccionada("");
    } catch (err) {
      console.error(err);
      onMensaje("✗ Error al guardar los requisitos de recuperación. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Crear Requisitos de Recuperación</h3>
        <button
          onClick={onVolver}
          className="text-sm text-sky-700 hover:underline"
        >
          ← Volver
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">UEA *</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={ueaSeleccionada}
          onChange={(e) => setUeaSeleccionada(e.target.value)}
        >
          <option value="">Selecciona una UEA...</option>
          {ueas.map((u) => (
            <option key={u.id} value={u.id}>
              {u.clave} - {u.nombre} (Trimestre {u.trimestre})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Duración *</label>
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          value={recuperacion.duracion}
          onChange={(e) => setRecuperacion({ ...recuperacion, duracion: e.target.value })}
          placeholder="Ej. 2 horas, 90 minutos"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Material Necesario *</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          rows="3"
          value={recuperacion.material}
          onChange={(e) => setRecuperacion({ ...recuperacion, material: e.target.value })}
          placeholder="Lista de materiales que el alumno debe llevar"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas Importantes</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          rows="3"
          value={recuperacion.notas}
          onChange={(e) => setRecuperacion({ ...recuperacion, notas: e.target.value })}
          placeholder="Indicaciones especiales para el examen de recuperación"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Requisitos *</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          rows="3"
          value={recuperacion.requisitos}
          onChange={(e) => setRecuperacion({ ...recuperacion, requisitos: e.target.value })}
          placeholder="Requisitos que debe cumplir el alumno para presentar recuperación"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Espacio</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={recuperacion.espacio}
          onChange={(e) => setRecuperacion({ ...recuperacion, espacio: e.target.value })}
        >
          <option value="">Selecciona un espacio...</option>
          {espacios.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.lugar} {esp.codigo ? `(${esp.codigo})` : ""}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGuardarRecuperacion}
        disabled={loading || !ueaSeleccionada}
        className="w-full bg-emerald-600 text-white py-3 rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        {loading ? "Guardando..." : "Guardar Requisitos de Recuperación"}
      </button>
    </div>
  );
}