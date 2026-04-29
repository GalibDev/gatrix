import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const emptyForm = {
  question_en: "",
  answer_en: "",
  question_bn: "",
  answer_bn: "",
  keywords: "",
  sort_order: 0,
  is_active: true,
};

export default function AIFAQAdmin() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    const { data, error } = await supabase
      .from("ai_faqs")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setFaqs(data || []);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(faq) {
    setEditingId(faq.id);
    setForm({
      question_en: faq.question_en || "",
      answer_en: faq.answer_en || "",
      question_bn: faq.question_bn || "",
      answer_bn: faq.answer_bn || "",
      keywords: faq.keywords || "",
      sort_order: faq.sort_order || 0,
      is_active: faq.is_active ?? true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      question_en: form.question_en,
      answer_en: form.answer_en,
      question_bn: form.question_bn,
      answer_bn: form.answer_bn,
      keywords: form.keywords,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    const result = editingId
      ? await supabase.from("ai_faqs").update(payload).eq("id", editingId)
      : await supabase.from("ai_faqs").insert([payload]);

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    alert(editingId ? "FAQ updated!" : "FAQ added!");
    resetForm();
    fetchFaqs();
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this FAQ?");
    if (!ok) return;

    const { error } = await supabase.from("ai_faqs").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchFaqs();
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-pink-400">
              Evana AI FAQ
            </h1>
            <p className="mt-2 text-slate-400">
              Add, edit, delete English and Bangla FAQ answers.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="w-fit rounded-xl border border-pink-500/30 px-5 py-3 font-semibold text-pink-300 hover:bg-pink-500/10"
          >
            Back to Dashboard
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-3xl border border-pink-500/20 bg-slate-900 p-6"
        >
          <h2 className="mb-5 text-2xl font-bold text-pink-400">
            {editingId ? "Edit FAQ" : "Add FAQ"}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="question_en"
              value={form.question_en}
              onChange={handleChange}
              placeholder="Question English"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="question_bn"
              value={form.question_bn}
              onChange={handleChange}
              placeholder="Question Bangla"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <textarea
              name="answer_en"
              value={form.answer_en}
              onChange={handleChange}
              placeholder="Answer English"
              rows="4"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <textarea
              name="answer_bn"
              value={form.answer_bn}
              onChange={handleChange}
              placeholder="Answer Bangla"
              rows="4"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="keywords"
              value={form.keywords}
              onChange={handleChange}
              placeholder="Keywords comma separated: team, project, contact, দল"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />

            <input
              name="sort_order"
              type="number"
              value={form.sort_order}
              onChange={handleChange}
              placeholder="Sort order"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
              <input
                name="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              disabled={loading}
              className="rounded-xl bg-pink-400 px-6 py-3 font-bold text-slate-950 disabled:opacity-60"
            >
              {loading ? "Saving..." : editingId ? "Update FAQ" : "Add FAQ"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-slate-700 px-6 py-3 font-bold text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="grid gap-5">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-3xl border border-pink-500/20 bg-slate-900 p-5"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">
                    Order: {faq.sort_order || 0} •{" "}
                    {faq.is_active ? "Active" : "Inactive"}
                  </p>
                  <h3 className="text-xl font-bold text-pink-400">
                    {faq.question_en || "No English question"}
                  </h3>
                  <h3 className="mt-1 text-lg font-semibold text-pink-300">
                    {faq.question_bn || "No Bangla question"}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(faq)}
                    className="rounded-xl bg-amber-400 px-4 py-2 font-bold text-slate-950"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="rounded-xl bg-rose-500 px-4 py-2 font-bold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-slate-300">{faq.answer_en}</p>
              <p className="mt-2 text-slate-300">{faq.answer_bn}</p>

              <p className="mt-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-400">
                Keywords: {faq.keywords || "None"}
              </p>
            </div>
          ))}

          {faqs.length === 0 && (
            <div className="rounded-2xl border border-pink-500/20 bg-slate-900 p-6 text-center text-slate-400">
              No FAQ added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}