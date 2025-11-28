import { useState, useEffect } from "react";
import api from "../api";

export default function DocumentList({ documentType, onEdit, onDelete, onBack }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getEndpoint = () => {
    return documentType === "carta" 
      ? "academics/profesor/cartas/"
      : "academics/profesor/recuperaciones/";
  };

  const getTitle = () => {
    return documentType === "carta" 
      ? "Cartas Temáticas"
      : "Requisitos de Recuperación";
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(getEndpoint());
      setDocuments(res.data);
    } catch (err) {
      console.error("Error cargando documentos:", err);
      setError("Error al cargar los documentos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este documento?")) return;
    
    try {
      await api.delete(`${getEndpoint()}${id}/`);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (err) {
      console.error("Error eliminando documento:", err);
      setError("Error al eliminar el documento");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center">Cargando documentos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{getTitle()}</h3>
        <button
          onClick={onBack}
          className="text-sm text-sky-700 hover:underline"
        >
          ← Volver
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-800">
          {error}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No tienes documentos de este tipo.</p>
          <p className="text-sm mt-2">Crea tu primer documento usando la opción "Crear".</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">
                    {documentType === "carta" 
                      ? `${doc.uea_detalle?.clave} - ${doc.uea_detalle?.nombre}`
                      : `${doc.uea_detalle?.clave} - Recuperación`
                    }
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {documentType === "carta" 
                      ? doc.descripcion?.substring(0, 100) + (doc.descripcion?.length > 100 ? "..." : "")
                      : `Duración: ${doc.duracion || "No especificada"}`
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Creado: {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(doc)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}