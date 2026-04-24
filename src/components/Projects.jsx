import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Projects({
  title,
  labels,
  filter,
  setFilter,
  theme,
}) {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteProjects");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
      setProjects([]);
    } else {
      setProjects(data || []);
    }
  }

  // ❤️ LIKE SYSTEM (DB BASED)
  async function handleLike(id) {
    const project = projects.find((p) => p.id === id);

    await supabase
      .from("projects")
      .update({ likes: (project.likes || 0) + 1 })
      .eq("id", id);

    fetchProjects();
  }

  // ⭐ FAVORITE (LOCAL)
  useEffect(() => {
    localStorage.setItem("favoriteProjects", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const buttons = [
    { key: "all", label: labels.all },
    { key: "robotics", label: labels.robotics },
    { key: "iot", label: labels.iot },
    { key: "automation", label: labels.automation },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchCategory =
        filter === "all" ||
        project.category?.toLowerCase() === filter.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [projects, searchTerm, filter]);

  return (
    <section id="projects" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* TITLE + SEARCH */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold text-cyan-400">{title}</h2>

          <input
            type="text"
            placeholder={labels.search || "Search projects..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none sm:max-w-xs ${
              theme === "dark"
                ? "border-cyan-500/20 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-900"
            }`}
          />
        </div>

        {/* FILTER */}
        <div className="mb-8 flex flex-wrap gap-3">
          {buttons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`rounded-full px-4 py-2 text-sm transition sm:text-base ${
                filter === btn.key
                  ? "bg-cyan-500 text-black"
                  : "border border-cyan-500/30 hover:bg-cyan-500/10"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* PROJECT LIST */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => {
            const isFavorite = favorites.includes(project.id);

            return (
              <div
                key={project.id}
                className={`rounded-3xl border p-5 transition hover:scale-[1.02] hover:shadow-[0_0_20px_#22d3ee] sm:p-6 ${
                  theme === "dark"
                    ? "border-cyan-500/20 bg-slate-900"
                    : "border-slate-300 bg-white"
                }`}
              >
                <img
                  src={project.image_url || "https://via.placeholder.com/300"}
                  alt={project.title}
                  className="mb-4 h-44 w-full rounded-xl object-cover sm:h-48"
                />

                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold sm:text-xl">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm capitalize text-cyan-400 sm:text-base">
                      {project.category}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {/* ❤️ LIKE */}
                    <button
                      onClick={() => handleLike(project.id)}
                      className="rounded-full px-3 py-2 text-lg border border-cyan-500/30"
                    >
                      ❤️ {project.likes || 0}
                    </button>

                    {/* ⭐ FAVORITE */}
                    <button
                      onClick={() => toggleFavorite(project.id)}
                      className={`rounded-full px-3 py-2 text-lg transition ${
                        isFavorite
                          ? "bg-cyan-500 text-black"
                          : "border border-cyan-500/30 hover:bg-cyan-500/10"
                      }`}
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>
                  </div>
                </div>

                <p className="mb-4 text-sm leading-7 text-slate-400 sm:text-base">
                  {project.description}
                </p>

                {/* 🔥 TECH STACK (NO HARDCODE) */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tech_stack?.map((item, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-cyan-500/30 px-3 py-1 text-xs text-cyan-300 sm:text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mb-5 flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${
                      project.status === "Completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : project.status === "Ongoing"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-cyan-500/20 text-cyan-400"
                    }`}
                  >
                    {project.status}
                  </span>

                  <span className="text-xs text-slate-400 sm:text-sm">
                    Team: {project.team_members?.join(", ") || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setSelected(project)}
                    className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-black sm:w-auto"
                  >
                    {labels.viewDetails || "View Details"}
                  </button>

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full rounded-xl border border-cyan-500/30 px-4 py-3 text-center font-semibold sm:w-auto"
                    >
                      GitHub
                    </a>
                  )}

                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full rounded-xl border border-cyan-500/30 px-4 py-3 text-center font-semibold sm:w-auto"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY */}
        {filteredProjects.length === 0 && (
          <div className="mt-6 text-center">
            <p>{labels.noResults || "No projects found."}</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="max-w-2xl w-full bg-slate-900 p-6 rounded-2xl text-white">
            <img
              src={selected.image_url}
              className="mb-4 rounded-xl w-full h-60 object-cover"
            />
            <h2 className="text-2xl font-bold">{selected.title}</h2>
            <p className="text-cyan-400">{selected.category}</p>
            <p className="mt-4">{selected.description}</p>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 bg-cyan-500 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}