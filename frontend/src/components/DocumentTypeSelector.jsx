export default function DocumentTypeSelector({ onSelect }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold text-lg mb-4">Selecciona un documento:</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => onSelect("carta")}
          className="border border-sky-700 rounded-lg px-6 py-8 text-center text-sky-900 font-semibold text-lg hover:bg-sky-50 transition"
        >
          📄 Carta Temática
        </button>
        <button
          onClick={() => onSelect("recuperacion")}
          className="border border-sky-700 rounded-lg px-6 py-8 text-center text-sky-900 font-semibold text-lg hover:bg-sky-50 transition"
        >
          📋 Requisitos de Recuperación
        </button>
        <button
          onClick={() => onSelect("autoevaluacion")}
          className="border border-sky-700 rounded-lg px-6 py-8 text-center text-sky-900 font-semibold text-lg hover:bg-sky-50 transition"
        >
          ✍️ Autoevaluación
        </button>
      </div>
    </div>
  );
}