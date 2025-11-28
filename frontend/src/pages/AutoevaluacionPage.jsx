import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import AutoevaluacionForm from "../components/AutoevaluacionForm";

export default function AutoevaluacionPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");

  const handleBack = () => {
    navigate("/profesor");
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

      <AutoevaluacionForm 
        onVolver={handleBack}
        onMensaje={setMensaje}
      />
    </div>
  );
}