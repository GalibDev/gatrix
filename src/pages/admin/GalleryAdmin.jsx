import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const initialForm = {
  title: "",
  sort_order: 0,
  image_url: "",
  image_file: null,
  image_preview: "",
};

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setImages(data || []);
  }

  function setImageFile(file, mode = "add") {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (mode === "edit") {
      setEditForm((prev) => ({
        ...prev,
        image_file: file,
        image_preview: previewUrl,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        image_file: file,
        image_preview: previewUrl,
      }));
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "image_file") {
      setImageFile(files?.[0], "add");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditChange(e) {
    const { name, value, files } = e.target;

    if (name === "image_file") {
      setImageFile(files?.[0], "edit");
      return;
    }

    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDrop(e, mode = "add") {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    setImageFile(file, mode);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  async function uploadGalleryImage(file) {
    if (!file) return "";

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const filePath = `gallery/${fileName}`;

    const { error } = await supabase.storage
      .from("gallery-images")
      .upload(filePath, file);

    if (error) {
      alert(error.message);
      return "";
    }

    const { data } = supabase.storage
      .from("gallery-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleAdd(e) {
    e.preventDefault();

    if (!form.title) {
      alert("Title required");
      return;
    }

    if (!form.image_file && !form.image_url) {
      alert("Image required");
      return;
    }

    setUploading(true);

    let imageUrl = form.image_url;

    if (form.image_file) {
      imageUrl = await uploadGalleryImage(form.image_file);
    }

    if (!imageUrl) {
      setUploading(false);
      return;
    }

    const payload = {
      title: form.title,
      image_url: imageUrl,
      sort_order: Number(form.sort_order) || 0,
    };

    const { error } = await supabase.from("gallery_images").insert([payload]);

    setUploading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setForm(initialForm);
    fetchImages();
  }

  function startEdit(image) {
    setEditId(image.id);
    setEditForm({
      title: image.title || "",
      sort_order: image.sort_order || 0,
      image_url: image.image_url || "",
      image_file: null,
      image_preview: "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditId(null);
    setEditForm(initialForm);
  }

  async function handleUpdate(id) {
    if (!editForm.title) {
      alert("Title required");
      return;
    }

    setUploading(true);

    let imageUrl = editForm.image_url;

    if (editForm.image_file) {
      imageUrl = await uploadGalleryImage(editForm.image_file);
    }

    const payload = {
      title: editForm.title,
      image_url: imageUrl,
      sort_order: Number(editForm.sort_order) || 0,
    };

    const { error } = await supabase
      .from("gallery_images")
      .update(payload)
      .eq("id", id);

    setUploading(false);

    if (error) {
      alert(error.message);
      return;
    }

    cancelEdit();
    fetchImages();
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this gallery image?");
    if (!ok) return;

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchImages();
  }

  function ImageDropBox({ mode = "add" }) {
    const currentForm = mode === "edit" ? editForm : form;
    const changeHandler = mode === "edit" ? handleEditChange : handleChange;

    return (
      <div
        onDrop={(e) => handleDrop(e, mode)}
        onDragOver={handleDragOver}
        className="rounded-2xl border-2 border-dashed border-cyan-500/40 bg-slate-950 p-5 text-center transition hover:border-cyan-400 md:col-span-2"
      >
        {currentForm.image_preview || currentForm.image_url ? (
          <img
            src={currentForm.image_preview || currentForm.image_url}
            alt="Preview"
            className="mx-auto mb-4 h-56 w-full max-w-md rounded-2xl object-cover shadow-[0_0_20px_rgba(34,211,238,0.18)]"
          />
        ) : (
          <div className="mb-4 text-slate-400">
            Drag & drop image here, or choose file
          </div>
        )}

        <input
          type="file"
          name="image_file"
          accept="image/*"
          onChange={changeHandler}
          className="mx-auto block rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
        />

        {currentForm.image_file && (
          <p className="mt-3 text-sm text-cyan-400">
            Selected: {currentForm.image_file.name}
          </p>
        )}

        {uploading && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-cyan-400" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400">
              Manage Gallery
            </h1>
            <p className="mt-2 text-slate-400">
              Add, edit, delete, and reorder gallery images.
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
            Add Gallery Image
          </h2>

          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <input
              name="title"
              placeholder="Image Title"
              value={form.title}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="sort_order"
              type="number"
              placeholder="Sort Order"
              value={form.sort_order}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="image_url"
              placeholder="Image URL optional"
              value={form.image_url}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />

            <ImageDropBox mode="add" />

            <button
              disabled={uploading}
              className="rounded-xl bg-cyan-400 px-6 py-4 text-lg font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            >
              {uploading ? "Uploading..." : "Add Gallery Image"}
            </button>
          </form>
        </div>

        <div className="grid gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="rounded-3xl border border-cyan-500/15 bg-slate-900/80 p-5"
            >
              {editId === image.id ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                  />

                  <input
                    name="sort_order"
                    type="number"
                    value={editForm.sort_order}
                    onChange={handleEditChange}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                  />

                  <input
                    name="image_url"
                    value={editForm.image_url}
                    onChange={handleEditChange}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
                  />

                  <ImageDropBox mode="edit" />

                  <div className="flex gap-3 md:col-span-2">
                    <button
                      onClick={() => handleUpdate(image.id)}
                      disabled={uploading}
                      className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white disabled:opacity-60"
                    >
                      {uploading ? "Uploading..." : "Save"}
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="rounded-xl bg-slate-700 px-5 py-3 font-bold text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr]">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="h-44 w-full rounded-2xl object-cover lg:w-60"
                  />

                  <div>
                    <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <h2 className="text-2xl font-bold text-cyan-400">
                        {image.title}
                      </h2>

                      <span className="w-fit rounded-full border border-cyan-500/30 px-3 py-1 text-sm text-cyan-300">
                        Order: {image.sort_order || 0}
                      </span>
                    </div>

                    <p className="break-all text-sm text-slate-400">
                      {image.image_url}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => startEdit(image)}
                        className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(image.id)}
                        className="rounded-xl bg-rose-500 px-5 py-3 font-bold text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {images.length === 0 && (
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 text-center text-slate-400">
              No gallery images added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}