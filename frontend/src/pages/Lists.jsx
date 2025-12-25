// src/pages/Lists.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

// CSS
import "../assets/lists-bg.css";
import "../assets/lists.css";

// Mapa facción -> clase CSS
const FACTION_CLASS = {
  "Adepta Sororitas": "f-imperium-gold",
  "Adeptus Custodes": "f-custodes",
  "Adeptus Mechanicus": "f-mechanicus",
  "Adeptus Titanicus": "f-imperium-gold",
  "Astra Militarum": "f-guard",
  "Grey Knights": "f-grey-knights",
  "Imperial Agents": "f-imperium-gold",
  "Imperial Knights": "f-imperial-knights",
  "Space Marines": "f-space-marines",

  "Aeldari": "f-aeldari",
  "Drukhari": "f-drukhari",
  "Genestealer Cults": "f-gsc",
  "Leagues of Votann": "f-votann",
  "Necrons": "f-necrons",
  "Orks": "f-orks",
  "T'au Empire": "f-tau",
  "Tyranids": "f-tyranids",

  "Chaos Daemons": "f-chaos",
  "Chaos Knights": "f-chaos-knights",
  "Chaos Space Marines": "f-csm",
  "Death Guard": "f-death-guard",
  "Emperor’s Children": "f-emperors-children",
  "Thousand Sons": "f-thousand-sons",
  "World Eaters": "f-world-eaters",

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

  const printList = (id) => {
    const el = document.getElementById(`print-${id}`);
    if (!el) return;

    const printWindow = window.open("", "", "width=900,height=650");
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Lista</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #000;
            }
            h1 {
              margin-bottom: 12px;
            }
            .meta {
              margin-bottom: 6px;
              font-size: 14px;
            }
            pre {
              white-space: pre-wrap;
              margin-top: 20px;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          ${el.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="lists-bg">
      <div className="lists-content">
        <h1 className="lists-title">Mis Listas</h1>

        <div className="lists-grid">
          {lists.map((l) => {
            const factionClass =
              FACTION_CLASS[l.faction] || "f-default";

            return (
              <div
                key={l._id}
                className={`list-card ${factionClass}`}
              >
                {/* 👇 CONTENIDO IMPRIMIBLE */}
                <div id={`print-${l._id}`}>
                  <div className="list-title">{l.name}</div>

                  <div className="list-meta">
                    <b>Facción:</b> {l.faction}
                  </div>

                  <div className="list-meta">
                    <b>Destacamento:</b> {l.detachment}
                  </div>

                  {l.content && (
                    <pre>{l.content}</pre>
                  )}
                </div>

                {/* 👇 ACCIONES */}
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
                    className="btn-print"
                    onClick={() => printList(l._id)}
                  >
                    Imprimir
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
    </div>
  );
}
