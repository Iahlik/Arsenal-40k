// src/pages/EditList.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api/api";
import { FACTIONS, DETACHMENTS } from "../data/factions";

// CSS compartido
import "../assets/lists-bg.css";
import "./NewList.css";

export default function EditList() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    faction: "",
    detachment: "",
    points: "",
    listText: "",
  });

  useEffect(() => {
    apiRequest(`/lists/${id}`).then((data) => {
      setForm({
        name: data.name || "",
        faction: data.faction || "",
        detachment: data.detachment || "",
        points: data.points ?? "",
        listText: data.listText || "",
      });
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }

    if (!form.faction || !form.detachment) {
      alert("Debes seleccionar facción y destacamento");
      return;
    }

    try {
      await apiRequest(`/lists/${id}`, "PUT", {
        ...form,
        points: Number(form.points) || 0,
      });

      navigate("/lists");
    } catch (err) {
      console.error(err);
      alert("Error al guardar los cambios");
    }
  };

  return (
    <div className="lists-bg">
      <div className="newlist-page">
        <h1>Editar Lista</h1>

        <form className="newlist-form" onSubmit={submit}>
          {/* FILA SUPERIOR */}
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
                setForm({ ...form, points: e.target.value })
              }
              min={0}
            />

            {/* SELECT FACCION */}
            <select
              value={form.faction}
              onChange={(e) =>
                setForm({
                  ...form,
                  faction: e.target.value,
                  detachment: "",
                })
              }
              required
            >
              <option value="" disabled>
                Facción
              </option>

              {Object.entries(FACTIONS).map(([group, factions]) => (
                <optgroup key={group} label={group}>
                  {factions.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* SELECT DESTACAMENTO */}
          <select
            value={form.detachment}
            onChange={(e) =>
              setForm({ ...form, detachment: e.target.value })
            }
            disabled={!form.faction}
            required
          >
            <option value="" disabled>
              Destacamento
            </option>

            {(DETACHMENTS[form.faction] || []).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* TEXTO LISTA */}
          <textarea
            placeholder="Pega aquí la lista (New Recruit, Battlescribe, etc.)"
            value={form.listText}
            onChange={(e) =>
              setForm({ ...form, listText: e.target.value })
            }
          />

          <div className="list-actions">
            <button className="btn-edit" type="submit">
              Guardar Cambios
            </button>

            <button
              type="button"
              className="btn-delete"
              onClick={() => navigate("/lists")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
