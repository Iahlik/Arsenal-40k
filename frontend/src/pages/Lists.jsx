// src/pages/Lists.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import "../assets/lists.css";

// Mapa facción -> clase CSS
const FACTION_CLASS = {
  // IMPERIUM
  "Adepta Sororitas": "f-imperium-gold",
  "Adeptus Custodes": "f-custodes",
  "Adeptus Mechanicus": "f-mechanicus",
  "Adeptus Titanicus": "f-imperium-gold",
  "Astra Militarum": "f-guard",
  "Grey Knights": "f-grey-knights",
  "Imperial Agents": "f-imperium-gold",
  "Imperial Knights": "f-imperial-knights",
  "Space Marines": "f-space-marines",

  // XENOS
  "Aeldari": "f-aeldari",
  "Drukhari": "f-drukhari",
  "Genestealer Cults": "f-gsc",
  "Leagues of Votann": "f-votann",
  "Necrons": "f-necrons",
  "Orks": "f-orks",
  "T'au Empire": "f-tau",
  "Tyranids": "f-tyranids",

  // CHAOS
  "Chaos Daemons": "f-chaos",
  "Chaos Knights": "f-chaos-knights",
  "Chaos Space Marines": "f-csm",
  "Death Guard": "f-death-guard",
  "Emperor’s Children": "f-emperors-children",
  "Thousand Sons": "f-thousand-sons",
  "World Eaters": "f-world-eaters",

  // UNALIGNED
  "Unaligned Forces": "f-unaligned",
};

export default function Lists() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await apiRequest("/lists");
    setLists(data);
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta lista?")) return;
    await apiRequest(`/lists/${id}`, "DELETE");
    load();
  };

  const duplicate = async (list) => {
    const { _id, createdAt, updatedAt, __v, ...clean } = list;

    await apiRequest("/lists", "POST", {
      ...clean,
      name: `${clean.name} (copia)`,
    });

    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="lists-container">
      <h1>Mis Listas</h1>

      <div className="lists-grid">
        {lists.map((l) => {
          const factionClass =
            FACTION_CLASS[l.faction] || "f-default";

          return (
            <div
              key={l._id}
              className={`list-card ${factionClass}`}
            >
              <div className="list-title">{l.name}</div>

              <div className="list-meta">
                <b>Facción:</b> {l.faction}
              </div>

              <div className="list-meta">
                <b>Destacamento:</b> {l.detachment}
              </div>

              <div className="list-actions">
                <button
                  className="btn-edit"
                  onClick={() =>
                    navigate(`/lists/${l._id}/edit`)
                  }
                >
                  Editar
                </button>

                <button
                  className="btn-duplicate"
                  onClick={() => duplicate(l)}
                >
                  Duplicar
                </button>

                <button
                  className="btn-delete"
                  onClick={() => remove(l._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
