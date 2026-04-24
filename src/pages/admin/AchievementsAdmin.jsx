import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const initialForm = {
  title: "",
  subtitle: "",
  description: "",
  date: "",
};

export default function AchievementsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setItems(data || []);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title) {
      alert("Title required");
      return;
    }

    setLoading(true);

    if (editingId) {
      const { error } = await supabase
        .from("achievements")
        .update(form)
        .eq("id", editingId);

      setLoading(false);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Achievement updated");
    } else {
      const { error } = await supabase.from("achievements").insert([form]);

      setLoading(false);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Achievement added");
    }

    setForm(initialForm);
    setEditingId(null);
    fetchAchievements();
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      date: item.date || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this achievement?");
    if (!ok) return;

    const { error } = await supabase.from("achievements").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchAchievements();
  }

  function handleCancel() {
    setEditingId(null);
    setForm(initialForm);
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400">
              Manage Achievements
            </h1>
            <p className="mt-2 text-slate-400">
              Add, edit, and delete achievements and events.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="w-fit rounded-xl border border-cyan-500/30 px-5 py-3 font-semibold text-cyan-300 hover:bg-cyan-500/10"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-10 rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-6">
          <h2 className="mb-5 text-2xl font-bold text-cyan-400">
            {editingId ? "Edit Achievement" : "Add Achievement"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              required
            />

            <input
              name="date"
              placeholder="Date / Year"
              value={form.date}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="subtitle"
              placeholder="Subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="min-h-[130px] rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                disabled={loading}
                className="rounded-xl bg-cyan-400 px-6 py-4 text-lg font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Achievement"
                  : "Add Achievement"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl bg-slate-700 px-6 py-4 font-bold text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-cyan-500/15 bg-slate-900/80 p-5"
            >
              <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-bold text-cyan-400">
                  {item.title}
                </h2>

                <span className="w-fit rounded-full border border-cyan-500/30 px-3 py-1 text-sm text-cyan-300">
                  {item.date}
                </span>
              </div>

              <p className="mb-2 text-cyan-300">{item.subtitle}</p>
              <p className="text-slate-300">{item.description}</p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-xl bg-rose-500 px-5 py-3 font-bold text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 text-center text-slate-400">
              No achievements added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}