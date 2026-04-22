import { useEffect, useMemo, useState } from "react";

export default function Projects({
  title,
  labels,
  filter,
  setFilter,
  projects,
  theme,
}) {
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteProjects");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favoriteProjects", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const buttons = [
    { key: "all", label: labels.all },
    { key: "robotics", label: labels.robotics },
    { key: "iot", label: labels.iot },
    { key: "automation", label: labels.automation },
  ];

  const searchedProjects = useMemo(() => {
    return projects.filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  return (
    <section id="projects" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
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

        <div className="grid gap-6 md:grid-cols-2">
          {searchedProjects.map((project) => {
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
                  src={project.image}
                  alt={project.title}
                  className="mb-4 h-44 w-full rounded-xl object-cover sm:h-48"
                />

                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold sm:text-xl">{project.title}</h3>
                    <p className="mt-2 text-sm capitalize text-cyan-400 sm:text-base">
                      {project.category}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleFavorite(project.id)}
                    className={`rounded-full px-3 py-2 text-lg transition ${
                      isFavorite
                        ? "bg-cyan-500 text-black"
                        : "border border-cyan-500/30 hover:bg-cyan-500/10"
                    }`}
                    title="Favorite"
                  >
                    {isFavorite ? "♥" : "♡"}
                  </button>
                </div>

                <p className="mb-4 text-sm leading-7 text-slate-400 sm:text-base">
                  {project.shortDescription}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tech.map((item, index) => (
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
                    Team: {project.team.join(", ")}
                  </span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setSelected(project)}
                    className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:scale-[1.02] sm:w-auto"
                  >
                    {labels.viewDetails || "View Details"}
                  </button>

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full rounded-xl border border-cyan-500/30 px-4 py-3 text-center font-semibold transition hover:bg-cyan-500/10 sm:w-auto"
                    >
                      GitHub
                    </a>
                  )}

                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full rounded-xl border border-cyan-500/30 px-4 py-3 text-center font-semibold transition hover:bg-cyan-500/10 sm:w-auto"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {searchedProjects.length === 0 && (
          <div
            className={`mt-6 rounded-2xl border p-6 text-center ${
              theme === "dark"
                ? "border-cyan-500/20 bg-slate-900"
                : "border-slate-300 bg-white"
            }`}
          >
            <p>{labels.noResults || "No projects found."}</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div
            className={`max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 sm:p-8 ${
              theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-slate-900"
            }`}
          >
            <img
              src={selected.image}
              alt={selected.title}
              className="mb-5 h-52 w-full rounded-xl object-cover sm:h-72"
            />

            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold">{selected.title}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${
                  selected.status === "Completed"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : selected.status === "Ongoing"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-cyan-500/20 text-cyan-400"
                }`}
              >
                {selected.status}
              </span>
            </div>

            <p className="mb-3 text-cyan-400 capitalize">{selected.category}</p>

            <p className="mb-5 text-sm leading-7 sm:text-base">
              {selected.fullDescription}
            </p>

            <div className="mb-5">
              <h3 className="mb-2 font-semibold text-cyan-400">
                {labels.techTitle || "Technologies"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {selected.tech.map((item, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-cyan-500/30 px-3 py-1 text-xs sm:text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-cyan-400">
                {labels.teamTitle || "Team Members"}
              </h3>
              <p>{selected.team.join(", ")}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setSelected(null)}
                className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black sm:w-auto"
              >
                {labels.close}
              </button>

              {selected.github && (
                <a
                  href={selected.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full rounded-lg border border-cyan-500/30 px-4 py-3 text-center font-semibold transition hover:bg-cyan-500/10 sm:w-auto"
                >
                  GitHub
                </a>
              )}

              {selected.demo && (
                <a
                  href={selected.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full rounded-lg border border-cyan-500/30 px-4 py-3 text-center font-semibold transition hover:bg-cyan-500/10 sm:w-auto"
                >
                  Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}