import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function BirthdayAdmin() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    birth_month: 4,
    birth_day: 30,
    message: "",
    photo_url: "",
    is_active: true,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBirthday();
  }, []);

  async function fetchBirthday() {
    const { data, error } = await supabase
      .from("birthday_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setForm({
        name: data.name || "",
        role: data.role || "",
        birth_month: data.birth_month || 4,
        birth_day: data.birth_day || 30,
        message: data.message || "",
        photo_url: data.photo_url || "",
        is_active: data.is_active ?? true,
      });
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleFile(e) {
    const selected = e.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function uploadImage() {
    if (!file) return form.photo_url;

    const ext = file.name.split(".").pop();
    const fileName = `birthday-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("birthday-images")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("birthday-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    const photoUrl = await uploadImage();

    if (photoUrl === null) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("birthday_settings")
      .update({
        name: form.name,
        role: form.role,
        birth_month: Number(form.birth_month),
        birth_day: Number(form.birth_day),
        message: form.message,
        photo_url: photoUrl,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Birthday settings updated!");
    setFile(null);
    setPreview("");
    fetchBirthday();
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-pink-400">
              Birthday Settings
            </h1>
            <p className="mt-2 text-slate-400">
              Manage birthday celebration popup and photo.
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
          onSubmit={handleSave}
          className="rounded-3xl border border-pink-500/20 bg-slate-900 p-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Birthday person name"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Role"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="birth_day"
              type="number"
              min="1"
              max="31"
              value={form.birth_day}
              onChange={handleChange}
              placeholder="Birth day"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="birth_month"
              type="number"
              min="1"
              max="12"
              value={form.birth_month}
              onChange={handleChange}
              placeholder="Birth month"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Birthday message"
              rows="4"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />

            <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
              <input
                name="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={handleChange}
              />
              Birthday mode active
            </label>
          </div>

          {(preview || form.photo_url) && (
            <img
              src={preview || form.photo_url}
              alt="Birthday preview"
              className="mt-5 h-72 w-full rounded-2xl object-cover object-top"
            />
          )}

          <button
            disabled={loading}
            className="mt-6 rounded-xl bg-pink-400 px-6 py-3 font-bold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Birthday Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}