import { useState } from "react";
import api from "../api";

export default function AutoevaluacionForm({ onVolver, onMensaje }) {
  const [loading, setLoading] = useState(false);
  
  // Estados para Autoevaluación
  const [autoevaluacion, setAutoevaluacion] = useState({
    preguntas: "",
  });

  const handleGuardarAutoevaluacion = async () => {
    setLoading(true);
    onMensaje("");
    try {
      await api.post("academics/profesor/autoevaluaciones/", autoevaluacion);
      onMensaje("✓ Autoevaluación guardada exitosamente.");
      // Limpiar formulario
      setAutoevaluacion({
        preguntas: "",
      });
    } catch (err) {
      console.error(err);
      onMensaje("✗ Error al guardar la autoevaluación. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Realizar Autoevaluación</h3>
        <button
          onClick={onVolver}
          className="text-sm text-sky-700 hover:underline"
        >
          ← Volver
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Realiza tu autoevaluación docente del periodo actual. Reflexiona sobre tu desempeño, 
        metodologías aplicadas y resultados obtenidos.
      </p>

      <div>
        <label className="block text-sm font-medium mb-1">Autoevaluación *</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          rows="10"
          value={autoevaluacion.preguntas}
          onChange={(e) => setAutoevaluacion({ ...autoevaluacion, preguntas: e.target.value })}
          placeholder="Describe tu autoevaluación: logros, áreas de mejora, estrategias implementadas, reflexiones sobre tu práctica docente..."
        />
      </div>

      <button
        onClick={handleGuardarAutoevaluacion}
        disabled={loading || !autoevaluacion.preguntas.trim()}
        className="w-full bg-emerald-600 text-white py-3 rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        {loading ? "Guardando..." : "Guardar Autoevaluación"}
      </button>
    </div>
  );
}