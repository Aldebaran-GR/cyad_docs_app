import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export default function LogoutButton({ className = "" }) {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className={className || "bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-800 font-semibold"}
    >
      Cerrar sesión
    </button>
  );
}
