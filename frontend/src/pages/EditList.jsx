import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api/api";
import "../pages/NewList.css";

export default function EditList() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    faction: "",
    detachment: "",
    points: 0,
    listText: "",
  });

  useEffect(() => {
    apiRequest(`/lists/${id}`).then((data) => {
      setForm({
        name: data.name || "",
        faction: data.faction || "",
        detachment: data.detachment || "",
        points: data.points || 0,
        listText: data.listText || "",
      });
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    await apiRequest(`/lists/${id}`, "PUT", form);
    navigate("/lists");
  };

  return (
    <div className="newlist-page">
      <h1>Editar Lista</h1>

      <form className="newlist-form" onSubmit={submit}>
        <div className="newlist-row">
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />
          <input
            placeholder="Facción"
            value={form.faction}
            onChange={(e) =>
              setForm({ ...form, faction: e.target.value })
            }
            required
          />
          <input
            placeholder="Destacamento"
            value={form.detachment}
            onChange={(e) =>
              setForm({ ...form, detachment: e.target.value })
            }
          />
        </div>

        <div className="newlist-row">
          <input
            type="number"
            placeholder="Puntos"
            value={form.points}
            onChange={(e) =>
              setForm({ ...form, points: Number(e.target.value) })
            }
          />
        </div>

        <textarea
          placeholder="Contenido de la lista"
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
  );
}
