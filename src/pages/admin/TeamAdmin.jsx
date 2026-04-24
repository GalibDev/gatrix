import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const initialForm = {
  name: "",
  role: "",
  bio: "",
  image_url: "",
  image_file: null,
  image_preview: "",
  email: "",
  skills: "",
  facebook_url: "",
  linkedin_url: "",
  github_url: "",
  sort_order: 0,
};

export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setMembers(data || []);
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

  async function uploadTeamImage(file) {
    if (!file) return "";

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `team/${fileName}`;

    const { error } = await supabase.storage
      .from("team-images")
      .upload(filePath, file);

    if (error) {
      alert(error.message);
      return "";
    }

    const { data } = supabase.storage
      .from("team-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  function buildPayload(data) {
    return {
      name: data.name,
      role: data.role,
      bio: data.bio,
      image_url: data.image_url,
      email: data.email,
      facebook_url: data.facebook_url,
      linkedin_url: data.linkedin_url,
      github_url: data.github_url,
      sort_order: Number(data.sort_order) || 0,
      skills: data.skills
        ? data.skills.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    };
  }

  async function handleAdd(e) {
    e.preventDefault();

    if (!form.name || !form.role) {
      alert("Name and role required");
      return;
    }

    setUploading(true);

    let imageUrl = form.image_url;

    if (form.image_file) {
      imageUrl = await uploadTeamImage(form.image_file);
    }

    const payload = buildPayload({
      ...form,
      image_url: imageUrl,
    });

    const { error } = await supabase.from("team_members").insert([payload]);

    setUploading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setForm(initialForm);
    fetchMembers();
  }

  function handleStartEdit(member) {
    setEditingId(member.id);
    setEditForm({
      name: member.name || "",
      role: member.role || "",
      bio: member.bio || "",
      image_url: member.image_url || "",
      image_file: null,
      image_preview: "",
      email: member.email || "",
      facebook_url: member.facebook_url || "",
      linkedin_url: member.linkedin_url || "",
      github_url: member.github_url || "",
      sort_order: member.sort_order || 0,
      skills: Array.isArray(member.skills) ? member.skills.join(", ") : "",
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditForm(initialForm);
  }

  async function handleUpdate(id) {
    if (!editForm.name || !editForm.role) {
      alert("Name and role required");
      return;
    }

    setUploading(true);

    let imageUrl = editForm.image_url;

    if (editForm.image_file) {
      imageUrl = await uploadTeamImage(editForm.image_file);
    }

    const payload = buildPayload({
      ...editForm,
      image_url: imageUrl,
    });

    const { error } = await supabase
      .from("team_members")
      .update(payload)
      .eq("id", id);

    setUploading(false);

    if (error) {
      alert(error.message);
      return;
    }

    handleCancelEdit();
    fetchMembers();
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this team member?");
    if (!ok) return;

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchMembers();
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
            className="mx-auto mb-4 h-40 w-40 rounded-2xl object-cover shadow-[0_0_20px_rgba(34,211,238,0.18)]"
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
            <h1 className="text-4xl font-bold">Manage Team</h1>
            <p className="mt-2 text-slate-400">
              Add, edit and manage team members.
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
            Add Team Member
          </h2>

          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="skills"
              placeholder="Skills comma separated"
              value={form.skills}
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
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <ImageDropBox mode="add" />

            <input
              name="facebook_url"
              placeholder="Facebook URL"
              value={form.facebook_url}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="linkedin_url"
              placeholder="LinkedIn URL"
              value={form.linkedin_url}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            />

            <input
              name="github_url"
              placeholder="GitHub URL"
              value={form.github_url}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />

            <textarea
              name="bio"
              placeholder="Bio"
              value={form.bio}
              onChange={handleChange}
              className="min-h-[120px] rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
            />

            <button
              disabled={uploading}
              className="rounded-xl bg-cyan-400 px-6 py-4 text-lg font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            >
              {uploading ? "Uploading..." : "Add Member"}
            </button>
          </form>
        </div>

        <div className="grid gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-3xl border border-cyan-500/15 bg-slate-900/80 p-5"
            >
              {editingId === member.id ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                  />

                  <input
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                  />

                  <input
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                  />

                  <input
                    name="skills"
                    value={editForm.skills}
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
                    placeholder="Image URL optional"
                    value={editForm.image_url}
                    onChange={handleEditChange}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                  />

                  <ImageDropBox mode="edit" />

                  <input
                    name="facebook_url"
                    value={editForm.facebook_url}
                    onChange={handleEditChange}
                    placeholder="Facebook URL"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                  />

                  <input
                    name="linkedin_url"
                    value={editForm.linkedin_url}
                    onChange={handleEditChange}
                    placeholder="LinkedIn URL"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                  />

                  <input
                    name="github_url"
                    value={editForm.github_url}
                    onChange={handleEditChange}
                    placeholder="GitHub URL"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
                  />

                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleEditChange}
                    className="min-h-[100px] rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
                  />

                  <div className="flex gap-3 md:col-span-2">
                    <button
                      onClick={() => handleUpdate(member.id)}
                      disabled={uploading}
                      className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {uploading ? "Uploading..." : "Save"}
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      className="rounded-xl bg-slate-700 px-5 py-3 font-bold text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[160px_1fr]">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="h-[160px] w-[160px] rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-[160px] w-[160px] items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                      No Image
                    </div>
                  )}

                  <div>
                    <h2 className="text-3xl font-bold">{member.name}</h2>
                    <p className="mt-1 text-xl text-cyan-400">
                      {member.role}
                    </p>
                    <p className="mt-3 text-slate-300">{member.bio}</p>

                    {Array.isArray(member.skills) &&
                      member.skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {member.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="rounded-full border border-cyan-500/30 px-3 py-1 text-sm text-cyan-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleStartEdit(member)}
                        className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(member.id)}
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
        </div>
      </div>
    </div>
  );
}