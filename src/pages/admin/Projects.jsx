import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    status: "",
    tech_stack: "",
    image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from("projects").select("*").order("id", { ascending: false });
    setProjects(data || []);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(file) {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  async function uploadImage() {
    if (!imageFile) return form.image_url;

    const fileName = Date.now() + "_" + imageFile.name;

    const { error } = await supabase.storage
      .from("project-images")
      .upload(fileName, imageFile);

    if (error) {
      alert(error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const imageUrl = await uploadImage();

    const payload = {
      ...form,
      image_url: imageUrl,
      tech_stack: form.tech_stack.split(",").map(t => t.trim()),
    };

    if (editingId) {
      await supabase.from("projects").update(payload).eq("id", editingId);
      alert("Updated");
    } else {
      await supabase.from("projects").insert([payload]);
      alert("Added");
    }

    setForm({
      title: "",
      description: "",
      category: "",
      status: "",
      tech_stack: "",
      image_url: "",
    });

    setImageFile(null);
    setPreview(null);
    setEditingId(null);

    fetchProjects();
  }

  function handleEdit(p) {
    setEditingId(p.id);
    setForm({
      ...p,
      tech_stack: p.tech_stack?.join(", ") || "",
    });
    setPreview(p.image_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  }

  async function handleLike(id) {
    const p = projects.find(p => p.id === id);

    await supabase
      .from("projects")
      .update({ likes: (p.likes || 0) + 1 })
      .eq("id", id);

    fetchProjects();
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold text-cyan-400">
        {editingId ? "Edit Project" : "Add Project"}
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-10 grid gap-4 md:grid-cols-2">

        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input" required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="input" />

        <input name="status" placeholder="Status" value={form.status} onChange={handleChange} className="input" />
        <input name="tech_stack" placeholder="Tech stack (comma separated)" value={form.tech_stack} onChange={handleChange} className="input" />

        {/* DRAG DROP */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="col-span-2 rounded-xl border border-dashed border-cyan-500/30 p-6 text-center"
        >
          {preview ? (
            <img src={preview} className="mx-auto h-40 rounded-xl object-cover" />
          ) : (
            <p>Drag & Drop Image</p>
          )}

          <input type="file" onChange={(e) => handleFile(e.target.files[0])} className="mt-2" />
        </div>

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input col-span-2" />

        <button className="col-span-2 rounded-xl bg-cyan-500 py-3 font-bold text-black">
          {editingId ? "Update" : "Add Project"}
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-6">
        {projects.map((p) => (
          <div key={p.id} className="relative rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">

            {/* ❤️ LIKE */}
            <button
              onClick={() => handleLike(p.id)}
              className="absolute right-4 top-4"
            >
              ❤️ {p.likes || 0}
            </button>

            <div className="flex gap-5">
              <img
                src={p.image_url || "https://via.placeholder.com/120"}
                className="h-28 w-28 rounded-xl object-cover"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold text-cyan-400">{p.title}</h2>
                <p className="text-sm text-slate-300">{p.description}</p>

                {/* TECH STACK */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tech_stack?.map((tech, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-cyan-500/30 px-3 py-1 text-sm text-cyan-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <button onClick={() => handleEdit(p)} className="btn-yellow">
                    Edit
                  </button>

                  <button onClick={() => handleDelete(p.id)} className="btn-red">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}