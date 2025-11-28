import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import CRUDSelector from "../components/CRUDSelector";
import DocumentList from "../components/DocumentList";
import CartaTematicaForm from "../components/CartaTematicaForm";

export default function CartaTematicaPage() {
  const { user } = useAuthContext();
  const { operation } = useParams();
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleOperationSelect = (op) => {
    navigate(`/cartaTematica/${op}`);
  };

  const handleEdit = (data) => {
    setEditData(data);
    navigate("/cartaTematica/update");
  };

  const handleBack = () => {
    if (operation === "create" || operation === "update" || operation === "delete") {
      navigate("/cartaTematica");
    } else if (operation === "read") {
      navigate("/cartaTematica");
    } else {
      navigate("/profesor");
    }
    setMensaje("");
    setEditData(null);
  };

  const renderContent = () => {
    if (!operation) {
      return (
        <CRUDSelector 
          documentType="carta"
          onSelect={handleOperationSelect}
          onBack={() => navigate("/profesor")}
        />
      );
    }

    if (operation === "read") {
      return (
        <DocumentList 
          documentType="carta"
          onEdit={handleEdit}
          onDelete={() => {/* Handled in DocumentList component */}}
          onBack={handleBack}
        />
      );
    }

    if (operation === "create" || operation === "update") {
      return (
        <CartaTematicaForm 
          onVolver={handleBack}
          onMensaje={setMensaje}
          editData={editData}
        />
      );
    }

    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">
        Bienvenido/a {user?.first_name} {user?.last_name}
      </h2>

      {mensaje && (
        <div className={`p-4 rounded-lg ${mensaje.startsWith("✓") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {mensaje}
        </div>
      )}

      {renderContent()}
    </div>
  );
}