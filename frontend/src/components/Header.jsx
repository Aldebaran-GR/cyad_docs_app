import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-sky-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        CyAD · Gestión de Documentos
      </Link>
      <div className="flex items-center gap-4">
        
        {isAuthenticated ? (
          <button
            className="bg-white text-sky-900 font-semibold px-4 py-1 rounded shadow hover:bg-sky-100 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          location.pathname !== "/login" && (
            <button
              className="bg-white text-sky-900 font-semibold px-4 py-1 rounded shadow hover:bg-sky-100 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )
        )}
      </div>
    </header>
  );
}
