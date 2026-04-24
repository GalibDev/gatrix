import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function HeroSlidesAdmin() {
  const [slides, setSlides] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [settings, setSettings] = useState({
    slide_interval: 5000,
    show_arrows: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSlides();
    fetchSettings();
  }, []);

  async function fetchSlides() {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setSlides(data || []);
  }

  async function fetchSettings() {
    const { data, error } = await supabase
      .from("hero_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setSettings({
      slide_interval: data?.slide_interval || 5000,
      show_arrows: data?.show_arrows ?? true,
    });
  }

  function handleFile(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please select image file");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function uploadImage() {
    if (!file) {
      alert("Please select an image");
      return null;
    }

    const ext = file.name.split(".").pop();
    const fileName = `hero-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("hero-images")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("hero-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleAddSlide(e) {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await uploadImage();

    if (!imageUrl) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("hero_slides").insert([
      {
        image_url: imageUrl,
        title,
        sort_order: Number(sortOrder) || 0,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setFile(null);
    setPreview("");
    setTitle("");
    setSortOrder(0);
    fetchSlides();
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this slide?");
    if (!ok) return;

    const { error } = await supabase.from("hero_slides").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchSlides();
  }

  async function handleUpdateSort(id, value) {
    const { error } = await supabase
      .from("hero_slides")
      .update({ sort_order: Number(value) || 0 })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchSlides();
  }

  async function handleSaveSettings(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("hero_settings")
      .update({
        slide_interval: Number(settings.slide_interval) || 5000,
        show_arrows: settings.show_arrows,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Hero settings updated");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400">
              Hero Slider
            </h1>
            <p className="mt-2 text-slate-400">
              Add hero images, control slide time, and arrow visibility.
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
          onSubmit={handleSaveSettings}
          className="mb-10 rounded-3xl border border-cyan-500/20 bg-slate-900 p-6"
        >
          <h2 className="mb-5 text-2xl font-bold text-cyan-400">
            Slider Settings
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="number"
              value={settings.slide_interval}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  slide_interval: e.target.value,
                })
              }
              placeholder="Slide interval milliseconds"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
              <input
                type="checkbox"
                checked={settings.show_arrows}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    show_arrows: e.target.checked,
                  })
                }
              />
              Show left/right arrows
            </label>
          </div>

          <button className="mt-5 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950">
            Save Settings
          </button>
        </form>

        <form
          onSubmit={handleAddSlide}
          className="mb-10 rounded-3xl border border-cyan-500/20 bg-slate-900 p-6"
        >
          <h2 className="mb-5 text-2xl font-bold text-cyan-400">
            Add Hero Image
          </h2>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mb-5 h-64 w-full rounded-2xl object-cover object-top"
            />
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              type="number"
              placeholder="Sort order"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Image title optional"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />
          </div>

          <button
            disabled={loading}
            className="mt-5 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Add Slide"}
          </button>
        </form>

        <div className="grid gap-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-5"
            >
              <img
                src={slide.image_url}
                alt={slide.title || "Hero slide"}
                className="mb-4 h-64 w-full rounded-2xl object-cover object-top"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <input
                  defaultValue={slide.sort_order}
                  type="number"
                  onBlur={(e) => handleUpdateSort(slide.id, e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                />

                <div className="text-slate-300 md:col-span-1">
                  {slide.title || "No title"}
                </div>

                <button
                  onClick={() => handleDelete(slide.id)}
                  className="rounded-xl bg-rose-500 px-5 py-3 font-bold text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {slides.length === 0 && (
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 text-center text-slate-400">
              No hero slides added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}