// src/pages/NewList.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import "./NewList.css";

export default function NewList() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    faction: "",
    detachment: "",
    points: 0,
    listText: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    await apiRequest("/lists", "POST", form);
    navigate("/lists");
  };

  return (
    <div className="newlist-page">
      <h1>Nueva Lista</h1>

      <form className="newlist-form" onSubmit={submit}>
        <div className="newlist-row">
          <input
            placeholder="Nombre de la lista"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Puntos"
            value={form.points}
            onChange={(e) =>
              setForm({ ...form, points: Number(e.target.value) })
            }
          />

          <input
            placeholder="Facción"
            value={form.faction}
            onChange={(e) =>
              setForm({ ...form, faction: e.target.value })
            }
          />
        </div>

        <input
          placeholder="Destacamento"
          value={form.detachment}
          onChange={(e) =>
            setForm({ ...form, detachment: e.target.value })
          }
        />

        <textarea
          placeholder="Pega aquí la lista (New Recruit, Battlescribe, etc.)"
          value={form.listText}
          onChange={(e) =>
            setForm({ ...form, listText: e.target.value })
          }
        />

        <div className="list-actions">
          <button className="btn-edit" type="submit">
            Guardar Lista
          </button>
        </div>
      </form>
    </div>
  );
}
