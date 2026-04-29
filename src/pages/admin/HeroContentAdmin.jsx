import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const emptyForm = {
  title_en: "",
  subtitle_en: "",
  badge_en: "",
  btn_en: "",
  typing_en: "",

  title_bn: "",
  subtitle_bn: "",
  badge_bn: "",
  btn_bn: "",
  typing_bn: "",
};

export default function HeroContentAdmin() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  async function fetchHeroContent() {
    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setForm({
        title_en: data.title_en || "",
        subtitle_en: data.subtitle_en || "",
        badge_en: data.badge_en || "",
        btn_en: data.btn_en || "",
        typing_en: Array.isArray(data.typing_en) ? data.typing_en.join(", ") : "",

        title_bn: data.title_bn || "",
        subtitle_bn: data.subtitle_bn || "",
        badge_bn: data.badge_bn || "",
        btn_bn: data.btn_bn || "",
        typing_bn: Array.isArray(data.typing_bn) ? data.typing_bn.join(", ") : "",
      });
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function toArray(value) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("hero_content")
      .update({
        title_en: form.title_en,
        subtitle_en: form.subtitle_en,
        badge_en: form.badge_en,
        btn_en: form.btn_en,
        typing_en: toArray(form.typing_en),

        title_bn: form.title_bn,
        subtitle_bn: form.subtitle_bn,
        badge_bn: form.badge_bn,
        btn_bn: form.btn_bn,
        typing_bn: toArray(form.typing_bn),

        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Hero content updated successfully!");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400">Hero Content</h1>
            <p className="mt-2 text-slate-400">
              Edit hero text for English and Bangla.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="w-fit rounded-xl border border-cyan-500/30 px-5 py-3 font-semibold text-cyan-300 hover:bg-cyan-500/10"
          >
            Back to Dashboard
          </Link>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6"
        >
          <h2 className="mb-5 text-2xl font-bold text-cyan-400">English</h2>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="title_en"
              value={form.title_en}
              onChange={handleChange}
              placeholder="Hero title English"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="badge_en"
              value={form.badge_en}
              onChange={handleChange}
              placeholder="Badge English"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="btn_en"
              value={form.btn_en}
              onChange={handleChange}
              placeholder="Button text English"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="typing_en"
              value={form.typing_en}
              onChange={handleChange}
              placeholder="Typing texts English, comma separated"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <textarea
              name="subtitle_en"
              value={form.subtitle_en}
              onChange={handleChange}
              placeholder="Subtitle English"
              rows="4"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />
          </div>

          <h2 className="mb-5 text-2xl font-bold text-cyan-400">Bangla</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="title_bn"
              value={form.title_bn}
              onChange={handleChange}
              placeholder="Hero title Bangla"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="badge_bn"
              value={form.badge_bn}
              onChange={handleChange}
              placeholder="Badge Bangla"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="btn_bn"
              value={form.btn_bn}
              onChange={handleChange}
              placeholder="Button text Bangla"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="typing_bn"
              value={form.typing_bn}
              onChange={handleChange}
              placeholder="Typing texts Bangla, comma separated"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <textarea
              name="subtitle_bn"
              value={form.subtitle_bn}
              onChange={handleChange}
              placeholder="Subtitle Bangla"
              rows="4"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />
          </div>

          <button
            disabled={loading}
            className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Hero Content"}
          </button>
        </form>
      </div>
    </div>
  );
}