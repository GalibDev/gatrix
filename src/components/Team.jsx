import { useState } from "react";

export default function Team({ title, roleLabel, members, theme, teamText }) {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section id="team" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-bold text-cyan-400">{title}</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.id}
              className={`group relative overflow-hidden rounded-3xl border p-5 transition duration-300 hover:-translate-y-3 hover:shadow-[0_0_30px_#22d3ee] sm:p-6 ${
                theme === "dark"
                  ? "border-cyan-500/20 bg-slate-900"
                  : "border-slate-300 bg-white"
              }`}
            >
              <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl"></div>
                <div className="absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="overflow-hidden rounded-full">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="mb-4 h-24 w-24 rounded-full border border-cyan-500/30 object-cover transition duration-300 group-hover:scale-110 sm:h-28 sm:w-28"
                  />
                </div>

                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="mt-2 text-cyan-400">
                  {roleLabel}: {member.role}
                </p>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                  {member.bio}
                </p>

                <button
                  onClick={() => setSelectedMember(member)}
                  className="mt-5 rounded-xl border border-cyan-500/30 px-4 py-2 text-sm font-semibold transition hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_#22d3ee]"
                >
                  {teamText.viewProfile}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div
            className={`relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8 ${
              theme === "dark"
                ? "border-cyan-500/20 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-900"
            }`}
          >
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setSelectedMember(null)}
                className="rounded-full border border-cyan-500/30 px-3 py-1 text-sm transition hover:bg-cyan-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="mb-5 flex flex-col items-center text-center">
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="mb-4 h-28 w-28 rounded-full border border-cyan-500/30 object-cover shadow-[0_0_20px_#22d3ee]"
              />

              <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
              <p className="mt-2 text-cyan-400">
                {roleLabel}: {selectedMember.role}
              </p>
            </div>

            <div className="mb-5">
              <h3 className="mb-2 text-lg font-semibold text-cyan-400">
                About
              </h3>
              <p className="text-sm leading-7 sm:text-base">
                {selectedMember.bio}
              </p>
            </div>

            <div className="mb-5">
              <h3 className="mb-2 text-lg font-semibold text-cyan-400">
                {teamText.skills}
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedMember.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-cyan-500/30 px-3 py-1 text-xs sm:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-cyan-400">
                {teamText.contact}
              </h3>
              <p className="break-all">{selectedMember.email}</p>
            </div>

            <button
              onClick={() => setSelectedMember(null)}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:shadow-[0_0_20px_#22d3ee]"
            >
              {teamText.close}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}