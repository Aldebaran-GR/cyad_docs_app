import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import DocumentTypeSelector from "../components/DocumentTypeSelector";

export default function ProfesorDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleDocumentSelect = (type) => {
    switch (type) {
      case "carta":
        navigate("/cartaTematica");
        break;
      case "recuperacion":
        navigate("/requisitosRecuperacion");
        break;
      case "autoevaluacion":
        navigate("/autoevaluacion");
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">
        Bienvenido/a {user?.first_name} {user?.last_name}
      </h2>

      <DocumentTypeSelector onSelect={handleDocumentSelect} />
    </div>
  );
}
