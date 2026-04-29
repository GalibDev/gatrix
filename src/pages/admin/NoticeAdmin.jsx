import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function NoticeAdmin() {
  const [form, setForm] = useState({
    text_en: "",
    text_bn: "",
    link: "",
    is_active: true,
    sound_enabled: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotice();
  }, []);

  async function fetchNotice() {
    const { data } = await supabase
      .from("notice_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (data) setForm(data);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("notice_settings")
      .update({
        ...form,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Notice updated!");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-cyan-400 font-bold">
            Notice Settings
          </h1>
          <Link to="/admin/dashboard">Back</Link>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <input
            name="text_en"
            value={form.text_en}
            onChange={handleChange}
            placeholder="English Notice"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded"
          />

          <input
            name="text_bn"
            value={form.text_bn}
            onChange={handleChange}
            placeholder="Bangla Notice"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded"
          />

          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="Optional link"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded"
          />

          <label className="flex gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active
          </label>


<label className="flex gap-2">
  <input
    type="checkbox"
    name="sound_enabled"
    checked={form.sound_enabled}
    onChange={handleChange}
  />
  Enable Sound 🔊
</label>



          <button className="bg-cyan-400 text-black px-5 py-2 rounded">
            {loading ? "Saving..." : "Save Notice"}
          </button>
        </form>
      </div>
    </div>
  );
}