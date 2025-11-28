import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import DocumentTypeSelector from "../components/DocumentTypeSelector";
import CartaTematicaForm from "../components/CartaTematicaForm";
import RecuperacionForm from "../components/RecuperacionForm";
import AutoevaluacionForm from "../components/AutoevaluacionForm";

export default function ProfesorDashboard() {
  const { user } = useAuthContext();
  const [tipoDocumento, setTipoDocumento] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleVolver = () => {
    setTipoDocumento(null);
    setMensaje("");
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

      {!tipoDocumento && (
        <DocumentTypeSelector onSelect={setTipoDocumento} />
      )}

      {tipoDocumento === "carta" && (
        <CartaTematicaForm 
          onVolver={handleVolver}
          onMensaje={setMensaje}
        />
      )}

      {tipoDocumento === "recuperacion" && (
        <RecuperacionForm 
          onVolver={handleVolver}
          onMensaje={setMensaje}
        />
      )}

      {tipoDocumento === "autoevaluacion" && (
        <AutoevaluacionForm 
          onVolver={handleVolver}
          onMensaje={setMensaje}
        />
      )}
    </div>
  );
}
