import { useState } from "react";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { FACTIONS, DETACHMENTS } from "../data/factions";

export default function NewList() {
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [factionGroup, setFactionGroup] = useState("");
  const [faction, setFaction] = useState("");
  const [detachment, setDetachment] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const save = async () => {
    setError("");
    setOk("");

    try {
      await apiRequest(
        "/lists",
        "POST",
        { name, faction, detachment, content },
        token
      );
      setOk("Lista guardada correctamente");
      setName("");
      setFaction("");
      setFactionGroup("");
      setDetachment("");
      setContent("");
    } catch {
      setError("Error al guardar la lista");
    }
  };

  return (
    <div className="newlist-card">
      <h2>Nueva Lista</h2>

      <div className="row">
        <input
          placeholder="Nombre de la lista"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          value={factionGroup}
          onChange={(e) => {
            setFactionGroup(e.target.value);
            setFaction("");
            setDetachment("");
          }}
        >
          <option value="">Grupo</option>
          {Object.keys(FACTIONS).map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <select
          value={faction}
          onChange={(e) => {
            setFaction(e.target.value);
            setDetachment("");
          }}
          disabled={!factionGroup}
        >
          <option value="">Facción</option>
          {factionGroup &&
            FACTIONS[factionGroup].map((f) => (
              <option key={f}>{f}</option>
            ))}
        </select>

        <select
          value={detachment}
          onChange={(e) => setDetachment(e.target.value)}
          disabled={!DETACHMENTS[faction]}
        >
          <option value="">Destacamento</option>
          {DETACHMENTS[faction]?.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <textarea
        placeholder="Pega aquí la lista (New Recruit, Battlescribe, texto libre)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {error && <p className="error">{error}</p>}
      {ok && <p className="ok">{ok}</p>}

      <button onClick={save}>Guardar Lista</button>
    </div>
  );
}
