// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setResetUrl("");

    try {
      const data = await apiRequest("/auth/forgot-password", "POST", { email });

      // En DEV el backend te devuelve un resetUrl (y además lo loguea)
      if (data.resetUrl) {
        console.log("🔑 Enlace de recuperación:", data.resetUrl);
        setResetUrl(data.resetUrl);
      }

      setMsg(data.message || "Si el correo existe, se envió un enlace.");

      // Redirigir al login luego de 2s (opcional)
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <form className="auth-card" onSubmit={submit}>
      <h2>Recuperar contraseña</h2>

      <div className="row">
        <input
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Enviar enlace</button>
      </div>

      {msg && <p className="muted">{msg}</p>}

      {/* DEV helper: mostrar link en pantalla */}
      {resetUrl && (
        <p className="muted">
          Enlace (DEV):{" "}
          <a href={resetUrl} target="_blank" rel="noreferrer">
            abrir reset
          </a>
        </p>
      )}

      <p>
        <Link to="/login">Volver al login</Link>
      </p>
    </form>
  );
}
