import { useState, useEffect } from "react";
import api from "../api";

export default function CartaTematicaForm({ onVolver, onMensaje, editData = null }) {
  const [ueas, setUeas] = useState([]);
  const [ueaSeleccionada, setUeaSeleccionada] = useState(editData?.uea || "");
  const [loading, setLoading] = useState(false);
  const isEditing = !!editData;
  
  // Estados para Carta Temática
  const [carta, setCarta] = useState({
    descripcion: editData?.descripcion || "",
    contenido_sintetico: editData?.contenido_sintetico || "",
    modalidad_conduccion: editData?.modalidad_conduccion || "",
    modalidad_evaluacion: editData?.modalidad_evaluacion || "",
    conocimientos_previos: editData?.conocimientos_previos || "",
    asesorias: editData?.asesorias || "",
    bibliografia: editData?.bibliografia || "",
    calendarizacion: editData?.calendarizacion || "",
  });

  // Estados para Objetivo (parte de Carta Temática)
  const [objetivo, setObjetivo] = useState({
    aprendizaje: editData?.objetivo?.aprendizaje || "",
    general: editData?.objetivo?.general || "",
    particulares: editData?.objetivo?.particulares || "",
  });

  useEffect(() => {
    cargarUEAsProfesor();
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

  const handleGuardarCarta = async () => {
    if (!ueaSeleccionada) {
      onMensaje("Selecciona una UEA antes de guardar.");
      return;
    }
    setLoading(true);
    onMensaje("");
    try {
      const payload = { ...carta, uea: ueaSeleccionada };
      
      if (isEditing) {
        await api.put(`academics/profesor/cartas/${editData.id}/`, payload);
        onMensaje("✓ Carta temática actualizada exitosamente.");
      } else {
        await api.post("academics/profesor/cartas/", payload);
        onMensaje("✓ Carta temática guardada exitosamente.");
        
        // Limpiar formulario solo si estamos creando
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
        setUeaSeleccionada("");
      }
      
      // Si se llenaron datos de objetivo, guardarlo también
      if (objetivo.aprendizaje || objetivo.general || objetivo.particulares) {
        const objetivoPayload = { ...objetivo, uea: ueaSeleccionada };
        if (isEditing && editData.objetivo_id) {
          await api.put(`academics/profesor/objetivos/${editData.objetivo_id}/`, objetivoPayload);
        } else {
          await api.post("academics/profesor/objetivos/", objetivoPayload);
        }
      }
      
      if (!isEditing) {
        setObjetivo({
          aprendizaje: "",
          general: "",
          particulares: "",
        });
      }
    } catch (err) {
      console.error(err);
      onMensaje(`✗ Error al ${isEditing ? 'actualizar' : 'guardar'} la carta temática. Verifica los datos.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {isEditing ? "Editar Carta Temática" : "Crear Carta Temática"}
        </h3>
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
        {loading 
          ? (isEditing ? "Actualizando..." : "Guardando...")
          : (isEditing ? "Actualizar Carta Temática" : "Guardar Carta Temática")
        }
      </button>
    </div>
  );
}