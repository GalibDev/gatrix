import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Settings() {
  const [logoUrl, setLogoUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setLogoUrl(data?.logo_url || "");
    setPreview(data?.logo_url || "");
  }

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function uploadLogo() {
    if (!file) return logoUrl;

    const ext = file.name.split(".").pop();
    const fileName = `logo-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("site-assets")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("site-assets")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    const newLogoUrl = await uploadLogo();

    if (!newLogoUrl) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("site_settings")
      .update({
        logo_url: newLogoUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setLogoUrl(newLogoUrl);
    setFile(null);
    alert("Logo updated successfully");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400">
              Site Settings
            </h1>
            <p className="mt-2 text-slate-400">
              Change website logo from admin panel.
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
          <h2 className="mb-5 text-2xl font-bold text-cyan-400">
            Website Logo
          </h2>

          {preview && (
            <img
              src={preview}
              alt="Logo Preview"
              className="mb-5 h-28 w-28 rounded-xl border border-cyan-500/30 object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-5 block rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
          />

          <button
            disabled={loading}
            className="rounded-xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Logo"}
          </button>
        </form>
      </div>
    </div>
  );
}