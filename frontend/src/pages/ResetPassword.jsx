// src/pages/ResetPassword.jsx
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!token) return setMsg("Token faltante en la URL.");
    if (password.length < 6) return setMsg("La contraseña debe tener mínimo 6 caracteres.");
    if (password !== password2) return setMsg("Las contraseñas no coinciden.");

    try {
      const data = await apiRequest("/auth/reset-password", "POST", {
        token,
        password,
      });

      setMsg(data.message || "Contraseña actualizada.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <form className="auth-card" onSubmit={submit}>
      <h2>Recuperar Contraseña</h2>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />

      <button type="submit">Cambiar contraseña</button>

      {msg && <p className="muted">{msg}</p>}

      <p>
        <Link to="/login">Volver al login</Link>
      </p>
    </form>
  );
}
