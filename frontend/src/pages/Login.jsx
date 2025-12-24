import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest("/auth/login", "POST", {
        email,
        password,
      });

      setToken(data.token);
      navigate("/lists");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form className="auth-card" onSubmit={submit}>
      <h2>Acceso al Arsenal</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Entrar</button>

      <p>
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </p>

      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </form>
  );
}
