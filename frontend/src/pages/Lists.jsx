import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../assets/lists.css";

export default function Lists() {
  const [lists, setLists] = useState([]);
  const { token } = useAuth();

  const load = async () => {
    const data = await apiRequest("/lists", "GET", null, token);
    setLists(data);
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta lista?")) return;
    await apiRequest(`/lists/${id}`, "DELETE", null, token);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="lists-container">
      <h1>Mis Listas</h1>

      {lists.length === 0 && (
        <p style={{ color: "#aaa", marginTop: 30 }}>
          Aún no has creado listas.
        </p>
      )}

      <div className="lists-grid">
        {lists.map((l) => (
          <div key={l._id} className="list-card">
            <div className="list-title">{l.name}</div>

            <div className="list-meta">
              <b>Facción:</b> {l.faction}
            </div>

            <div className="list-meta">
              <b>Destacamento:</b> {l.detachment}
            </div>

            <div className="list-actions">
              <button
                className="btn-delete"
                onClick={() => remove(l._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
