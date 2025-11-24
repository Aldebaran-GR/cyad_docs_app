import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("auth/login/", { username, password });
      const { access, user } = res.data;
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));
      setAuthToken(access);
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "PROFESOR") navigate("/profesor");
      else navigate("/");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Usuario</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-sky-700 text-white py-2 rounded hover:bg-sky-800"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
