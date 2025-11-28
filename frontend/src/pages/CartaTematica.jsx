import { useEffect, useState } from "react";
import api from "../api";

export default function CartaTematica() {
  const [licenciaturas, setLicenciaturas] = useState([]);
  const [licenciaturaId, setLicenciaturaId] = useState("");
  const [licenciaturaNombre, setLicenciaturaNombre] = useState("");
  const [trimestreData, setTrimestreData] = useState({});
  const [trimestreAbierto, setTrimestreAbierto] = useState(null);
  const [ueaAbierta, setUeaAbierta] = useState(null);
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [selectedUea, setSelectedUea] = useState(null);
  const [documento, setDocumento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("academics/public/licenciaturas/")
      .then(res => {
        setLicenciaturas(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!licenciaturaId) return;
    const cargarTrimestres = async () => {
      const data = {};
      for (let i = 1; i <= 12; i++) {
        try {
          const resUeas = await api.get("academics/public/ueas/", { 
            params: { licenciatura_id: licenciaturaId, trimestre: i.toString() } 
          });
          if (resUeas.data.length > 0) {
            const ueasConProfesores = await Promise.all(
              resUeas.data.map(async (uea) => {
                const resProfes = await api.get("academics/public/profesores/", {
                  params: { uea_id: uea.id }
                });
                return { ...uea, profesores: resProfes.data };
              })
            );
            data[i] = ueasConProfesores;
          }
        } catch (error) {
          // Ignorar trimestres sin datos
        }
      }
      setTrimestreData(data);
    };
    cargarTrimestres();
  }, [licenciaturaId]);

  const toggleTrimestre = (trimestre) => {
    setTrimestreAbierto(trimestreAbierto === trimestre ? null : trimestre);
    setUeaAbierta(null);
  };

  const toggleUea = (ueaId) => {
    setUeaAbierta(ueaAbierta === ueaId ? null : ueaId);
  };

  const consultarDocumento = async (uea, profesor) => {
    setSelectedUea(uea);
    setSelectedProfesor(profesor);
    const res = await api.get("academics/public/documentos/", {
      params: { uea_id: uea.id, profesor_id: profesor.num_economico },
    });
    setDocumento(res.data);
  };

  const getTrimestresConDatos = () => {
    return Object.keys(trimestreData).sort((a, b) => parseInt(a) - parseInt(b));
  };

  const getNombreTrimestre = (num) => {
    const nombres = {
      1: "Primer", 2: "Segundo", 3: "Tercer", 4: "Cuarto",
      5: "Quinto", 6: "Sexto", 7: "Séptimo", 8: "Octavo",
      9: "Noveno", 10: "Décimo", 11: "Décimo Primer", 12: "Décimo Segundo"
    };
    return nombres[num] || num;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Consulta de Carta Temática</h2>
      <p className="text-sm text-gray-700">
        Selecciona tu licenciatura para consultar la carta temática.
      </p>

      {!licenciaturaId && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <label className="block text-sm font-medium mb-1">Licenciatura</label>
          {loading ? (
            <div className="text-gray-500 text-sm">Cargando licenciaturas...</div>
          ) : (
            <div className="space-y-2">
              {licenciaturas.map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    setLicenciaturaId(l.id);
                    setLicenciaturaNombre(l.nombre);
                  }}
                  className="cursor-pointer border rounded px-4 py-3 transition bg-white hover:bg-sky-50 border-gray-300 hover:border-sky-700"
                >
                  <p className="font-medium">{l.nombre}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {licenciaturaId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-red-600">{licenciaturaNombre}</h3>
            <button
              onClick={() => {
                setLicenciaturaId("");
                setLicenciaturaNombre("");
                setTrimestreData({});
                setTrimestreAbierto(null);
                setUeaAbierta(null);
                setDocumento(null);
              }}
              className="text-sm text-sky-700 hover:underline"
            >
              Cambiar licenciatura
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg">
            {getTrimestresConDatos().map((trim) => (
              <div key={trim} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={() => toggleTrimestre(parseInt(trim))}
                  className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 flex items-center justify-between"
                >
                  <span className="font-medium text-gray-700">{getNombreTrimestre(parseInt(trim))} Trimestre:</span>
                  <span className="text-gray-500">{trimestreAbierto === parseInt(trim) ? "▼" : "▶"}</span>
                </button>
                
                {trimestreAbierto === parseInt(trim) && (
                  <div className="bg-white">
                    {trimestreData[trim].map((uea) => (
                      <div key={uea.id} className="border-b border-gray-100 last:border-b-0">
                        <button
                          onClick={() => toggleUea(uea.id)}
                          className="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className="text-red-600 font-medium text-sm">
                            ▼ {uea.nombre} ({uea.clave})
                          </span>
                        </button>
                        
                        {ueaAbierta === uea.id && uea.profesores && (
                          <div className="bg-gray-50 px-8 py-2">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-300">
                                  <th className="text-left py-2 text-gray-600">Nombre</th>
                                  <th className="text-left py-2 text-gray-600">Grupo</th>
                                </tr>
                              </thead>
                              <tbody>
                                {uea.profesores.map((prof) => (
                                  <tr 
                                    key={prof.num_economico}
                                    onClick={() => consultarDocumento(uea, prof)}
                                    className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                                  >
                                    <td className="py-2 text-gray-700">
                                      {prof.nombre} {prof.p_apellido} {prof.s_apellido || ""}
                                    </td>
                                    <td className="py-2 text-gray-700">{uea.grupo?.nombre_grupo || "N/A"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {documento && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Carta Temática</h3>
          {documento.carta_tematica ? (
            <div className="text-sm space-y-3">
              <div>
                <p className="font-semibold text-gray-700">Descripción:</p>
                <p className="text-gray-600">{documento.carta_tematica.descripcion}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Contenido sintético:</p>
                <p className="text-gray-600">{documento.carta_tematica.contenido_sintetico}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Modalidad de conducción:</p>
                <p className="text-gray-600">{documento.carta_tematica.modalidad_conduccion}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Modalidad de evaluación:</p>
                <p className="text-gray-600">{documento.carta_tematica.modalidad_evaluacion}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Conocimientos previos:</p>
                <p className="text-gray-600">{documento.carta_tematica.conocimientos_previos}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Asesorías:</p>
                <p className="text-gray-600">{documento.carta_tematica.asesorias}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Bibliografía:</p>
                <p className="text-gray-600">{documento.carta_tematica.bibliografia}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Calendarización:</p>
                <p className="text-gray-600">{documento.carta_tematica.calendarizacion}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">La carta temática aún no está disponible.</p>
          )}
        </div>
      )}
    </div>
  );
}
