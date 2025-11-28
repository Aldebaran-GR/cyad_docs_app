import { useState } from "react";

export default function CRUDSelector({ documentType, onSelect, onBack }) {
  const getDocumentTitle = () => {
    switch (documentType) {
      case "carta":
        return "Carta Temática";
      case "recuperacion":
        return "Requisitos de Recuperación";
      default:
        return "Documento";
    }
  };

  const operations = [
    { key: "create", label: "Crear", icon: "➕", description: "Crear nuevo documento" },
    { key: "read", label: "Consultar", icon: "👁️", description: "Ver documentos existentes" },
    { key: "update", label: "Editar", icon: "✏️", description: "Modificar documento existente" },
    { key: "delete", label: "Eliminar", icon: "🗑️", description: "Eliminar documento" }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {getDocumentTitle()} - Selecciona una operación:
        </h3>
        <button
          onClick={onBack}
          className="text-sm text-sky-700 hover:underline"
        >
          ← Volver
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {operations.map((operation) => (
          <button
            key={operation.key}
            onClick={() => onSelect(operation.key)}
            className="border border-sky-700 rounded-lg p-4 text-center text-sky-900 font-semibold hover:bg-sky-50 transition flex flex-col items-center space-y-2"
          >
            <span className="text-2xl">{operation.icon}</span>
            <span className="font-semibold">{operation.label}</span>
            <span className="text-xs text-gray-600">{operation.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}