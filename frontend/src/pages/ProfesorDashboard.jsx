import { useEffect, useState } from "react";
import api from "../api";

export default function ProfesorDashboard() {
  const [user, setUser] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState(null);
  const [ueas, setUeas] = useState([]);
  const [ueaSeleccionada, setUeaSeleccionada] = useState("");
  const [espacios, setEspacios] = useState([]);
  
  // Estados para Carta Temática
  const [carta, setCarta] = useState({
    descripcion: "",
    contenido_sintetico: "",
    modalidad_conduccion: "",
    modalidad_evaluacion: "",
    conocimientos_previos: "",
    asesorias: "",
    bibliografia: "",
    calendarizacion: "",
  });

  // Estados para Objetivo (parte de Carta Temática)
  const [objetivo, setObjetivo] = useState({
    aprendizaje: "",
    general: "",
    particulares: "",
  });

  // Estados para Requisitos de Recuperación
  const [recuperacion, setRecuperacion] = useState({
    duracion: "",
    material: "",
    notas: "",
    requisitos: "",
    espacio: "",
  });

  // Estados para Autoevaluación
  const [autoevaluacion, setAutoevaluacion] = useState({
    preguntas: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (tipoDocumento === "carta" || tipoDocumento === "recuperacion") {
      cargarUEAsProfesor();
    }
    if (tipoDocumento === "recuperacion") {
      cargarEspacios();
    }
  }, [tipoDocumento]);

  const cargarUEAsProfesor = async () => {
    try {
      const res = await api.get("academics/profesor/mis-ueas/");
      setUeas(res.data);
    } catch (err) {
      console.error("Error cargando UEAs:", err);
      setMensaje("Error al cargar tus UEAs. Verifica que tienes UEAs asignadas.");
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

  const handleGuardarCarta = async () => {
    if (!ueaSeleccionada) {
      setMensaje("Selecciona una UEA antes de guardar.");
      return;
    }
    setLoading(true);
    setMensaje("");
    try {
      const payload = { ...carta, uea: ueaSeleccionada };
      await api.post("academics/profesor/cartas/", payload);
      
      // Si se llenaron datos de objetivo, guardarlo también
      if (objetivo.aprendizaje || objetivo.general || objetivo.particulares) {
        await api.post("academics/profesor/objetivos/", { 
          ...objetivo, 
          uea: ueaSeleccionada 
        });
      }
      
      setMensaje("✓ Carta temática guardada exitosamente. No olvides marcarla como completada cuando esté lista.");
      // Limpiar formulario
      setCarta({
        descripcion: "",
        contenido_sintetico: "",
        modalidad_conduccion: "",
        modalidad_evaluacion: "",
        conocimientos_previos: "",
        asesorias: "",
        bibliografia: "",
        calendarizacion: "",
      });
      setObjetivo({
        aprendizaje: "",
        general: "",
        particulares: "",
      });
      setUeaSeleccionada("");
    } catch (err) {
      console.error(err);
      setMensaje("✗ Error al guardar la carta temática. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarRecuperacion = async () => {
    if (!ueaSeleccionada) {
      setMensaje("Selecciona una UEA antes de guardar.");
      return;
    }
    setLoading(true);
    setMensaje("");
    try {
      const payload = { ...recuperacion, uea: ueaSeleccionada };
      await api.post("academics/profesor/recuperaciones/", payload);
      setMensaje("✓ Requisitos de recuperación guardados exitosamente.");
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
      setMensaje("✗ Error al guardar los requisitos de recuperación. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarAutoevaluacion = async () => {
    setLoading(true);
    setMensaje("");
    try {
      await api.post("academics/profesor/autoevaluaciones/", autoevaluacion);
      setMensaje("✓ Autoevaluación guardada exitosamente.");
      // Limpiar formulario
      setAutoevaluacion({
        preguntas: "",
      });
    } catch (err) {
      console.error(err);
      setMensaje("✗ Error al guardar la autoevaluación. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Panel del Profesor</h2>
      {user && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="font-semibold mb-1">Bienvenido/a</h3>
          <p className="text-sm">Usuario: {user.username}</p>
          <p className="text-sm">Rol: {user.role}</p>
        </div>
      )}

      {mensaje && (
        <div className={`p-4 rounded-lg ${mensaje.startsWith("✓") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {mensaje}
        </div>
      )}

      {!tipoDocumento && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Selecciona el documento que deseas crear:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => setTipoDocumento("carta")}
              className="border border-sky-700 rounded-lg px-6 py-8 text-center text-sky-900 font-semibold text-lg hover:bg-sky-50 transition"
            >
              📄 Carta Temática
            </button>
            <button
              onClick={() => setTipoDocumento("recuperacion")}
              className="border border-sky-700 rounded-lg px-6 py-8 text-center text-sky-900 font-semibold text-lg hover:bg-sky-50 transition"
            >
              📋 Requisitos de Recuperación
            </button>
            <button
              onClick={() => setTipoDocumento("autoevaluacion")}
              className="border border-sky-700 rounded-lg px-6 py-8 text-center text-sky-900 font-semibold text-lg hover:bg-sky-50 transition"
            >
              ✍️ Autoevaluación
            </button>
          </div>
        </div>
      )}

      {tipoDocumento === "carta" && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Crear Carta Temática</h3>
            <button
              onClick={() => {
                setTipoDocumento(null);
                setMensaje("");
              }}
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
            <label className="block text-sm font-medium mb-1">Descripción *</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="3"
              value={carta.descripcion}
              onChange={(e) => setCarta({ ...carta, descripcion: e.target.value })}
              placeholder="Descripción general de la UEA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contenido Sintético *</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="3"
              value={carta.contenido_sintetico}
              onChange={(e) => setCarta({ ...carta, contenido_sintetico: e.target.value })}
              placeholder="Resumen del contenido del curso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Modalidad de Conducción</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="2"
              value={carta.modalidad_conduccion}
              onChange={(e) => setCarta({ ...carta, modalidad_conduccion: e.target.value })}
              placeholder="Descripción de cómo se conducirá el curso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Modalidad de Evaluación</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="2"
              value={carta.modalidad_evaluacion}
              onChange={(e) => setCarta({ ...carta, modalidad_evaluacion: e.target.value })}
              placeholder="Criterios y forma de evaluación"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Conocimientos Previos</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="2"
              value={carta.conocimientos_previos}
              onChange={(e) => setCarta({ ...carta, conocimientos_previos: e.target.value })}
              placeholder="Conocimientos que el alumno debe tener"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Asesorías</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={carta.asesorias}
              onChange={(e) => setCarta({ ...carta, asesorias: e.target.value })}
              placeholder="Horarios y lugares de asesorías"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bibliografía</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="3"
              value={carta.bibliografia}
              onChange={(e) => setCarta({ ...carta, bibliografia: e.target.value })}
              placeholder="Referencias bibliográficas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Calendarización</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="2"
              value={carta.calendarizacion}
              onChange={(e) => setCarta({ ...carta, calendarizacion: e.target.value })}
              placeholder="Planificación temporal del curso"
            />
          </div>

          <hr className="my-4" />
          <h4 className="font-semibold text-md mb-2">Objetivos (Opcional)</h4>

          <div>
            <label className="block text-sm font-medium mb-1">Aprendizaje</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="2"
              value={objetivo.aprendizaje}
              onChange={(e) => setObjetivo({ ...objetivo, aprendizaje: e.target.value })}
              placeholder="Objetivos de aprendizaje"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">General</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="2"
              value={objetivo.general}
              onChange={(e) => setObjetivo({ ...objetivo, general: e.target.value })}
              placeholder="Objetivo general del curso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Particulares</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="2"
              value={objetivo.particulares}
              onChange={(e) => setObjetivo({ ...objetivo, particulares: e.target.value })}
              placeholder="Objetivos particulares"
            />
          </div>

          <button
            onClick={handleGuardarCarta}
            disabled={loading || !ueaSeleccionada}
            className="w-full bg-emerald-600 text-white py-3 rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? "Guardando..." : "Guardar Carta Temática"}
          </button>
        </div>
      )}

      {tipoDocumento === "recuperacion" && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Crear Requisitos de Recuperación</h3>
            <button
              onClick={() => {
                setTipoDocumento(null);
                setMensaje("");
              }}
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
      )}

      {tipoDocumento === "autoevaluacion" && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Realizar Autoevaluación</h3>
            <button
              onClick={() => {
                setTipoDocumento(null);
                setMensaje("");
              }}
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
      )}
    </div>
  );
}
