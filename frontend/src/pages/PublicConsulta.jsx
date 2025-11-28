import { useEffect, useState } from "react";
import api from "../api";

export default function PublicConsulta({ initialLicenciaturaId = "", tipoDocumento = "" }) {
  const [licenciaturas, setLicenciaturas] = useState([]);
  const [licenciaturaId, setLicenciaturaId] = useState(initialLicenciaturaId);
  const [trimestres, setTrimestres] = useState([]);
  const [trimestre, setTrimestre] = useState("");
  const [ueas, setUeas] = useState([]);
  const [ueaId, setUeaId] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [profesorId, setProfesorId] = useState("");
  const [documentos, setDocumentos] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("academics/public/licenciaturas/");
      setLicenciaturas(res.data);
    };
    load();
  }, []);

  // Si cambia initialLicenciaturaId desde el padre, actualizar el estado
  useEffect(() => {
    if (initialLicenciaturaId && initialLicenciaturaId !== licenciaturaId) {
      setLicenciaturaId(initialLicenciaturaId);
    }
  }, [initialLicenciaturaId]);

  useEffect(() => {
    if (!licenciaturaId) return;
    setTrimestres([]);
    setTrimestre("");
    setUeas([]);
    setUeaId("");
    setProfesores([]);
    setProfesorId("");
    setDocumentos(null);
    api
      .get("academics/public/trimestres/", { params: { licenciatura_id: licenciaturaId } })
      .then((res) => setTrimestres(res.data));
  }, [licenciaturaId]);

  useEffect(() => {
    if (!trimestre) return;
    setUeas([]);
    setUeaId("");
    setProfesores([]);
    setProfesorId("");
    setDocumentos(null);
    api
      .get("academics/public/ueas/", { params: { licenciatura_id: licenciaturaId, trimestre } })
      .then((res) => setUeas(res.data));
  }, [trimestre]);

  useEffect(() => {
    if (!ueaId) return;
    setProfesores([]);
    setProfesorId("");
    setDocumentos(null);
    api
      .get("academics/public/profesores/", { params: { uea_id: ueaId } })
      .then((res) => setProfesores(res.data));
  }, [ueaId]);

  const consultar = async () => {
    const res = await api.get("academics/public/documentos/", {
      params: { uea_id: ueaId, profesor_id: profesorId },
    });
    setDocumentos(res.data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Consulta para alumnos</h2>
      <p className="text-sm text-gray-700">
        Selecciona tu licenciatura, trimestre, UEA y profesor para consultar la carta temática
        y los requisitos de recuperación (cuando el docente los haya marcado como completados).
      </p>

      <div className="grid md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Licenciatura</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={licenciaturaId}
            onChange={(e) => setLicenciaturaId(e.target.value)}
          >
            <option value="">Selecciona...</option>
            {licenciaturas.map((l) => (
              <option key={l.id} value={l.id}>{l.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Trimestre</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={trimestre}
            onChange={(e) => setTrimestre(e.target.value)}
            disabled={!trimestres.length}
          >
            <option value="">Selecciona...</option>
            {trimestres.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">UEA</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={ueaId}
            onChange={(e) => setUeaId(e.target.value)}
            disabled={!ueas.length}
          >
            <option value="">Selecciona...</option>
            {ueas.map((u) => (
              <option key={u.id} value={u.id}>{u.clave} · {u.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profesor</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={profesorId}
            onChange={(e) => setProfesorId(e.target.value)}
            disabled={!profesores.length}
          >
            <option value="">Selecciona...</option>
            {profesores.map((p) => (
              <option key={p.num_economico} value={p.num_economico}>
                {p.nombre} {p.p_apellido} {p.s_apellido || ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={consultar}
        disabled={!profesorId || !ueaId}
        className="bg-sky-700 text-white px-5 py-2 rounded disabled:opacity-50"
      >
        Consultar documentos
      </button>

      {documentos && tipoDocumento === "carta" && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Carta temática</h3>
          {documentos.carta_tematica ? (
            <div className="text-sm space-y-1">
              <p><span className="font-semibold">Descripción:</span> {documentos.carta_tematica.descripcion}</p>
              <p><span className="font-semibold">Contenido sintético:</span> {documentos.carta_tematica.contenido_sintetico}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aún no está disponible.</p>
          )}
        </div>
      )}
      {documentos && tipoDocumento === "recuperacion" && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Requisitos de recuperación</h3>
          {documentos.recuperacion ? (
            <div className="text-sm space-y-1">
              <p><span className="font-semibold">Duración:</span> {documentos.recuperacion.duracion}</p>
              <p><span className="font-semibold">Material:</span> {documentos.recuperacion.material}</p>
              <p><span className="font-semibold">Notas:</span> {documentos.recuperacion.notas}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aún no está disponible.</p>
          )}
        </div>
      )}
    </div>
  );
}
