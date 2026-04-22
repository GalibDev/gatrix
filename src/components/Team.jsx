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
              className={`rounded-3xl border p-5 transition hover:-translate-y-2 hover:shadow-[0_0_20px_#22d3ee] sm:p-6 ${
                theme === "dark"
                  ? "border-cyan-500/20 bg-slate-900"
                  : "border-slate-300 bg-white"
              }`}
            >
              <img
                src={member.image}
                alt={member.name}
                className="mb-4 h-20 w-20 rounded-full border border-cyan-500/30 object-cover sm:h-24 sm:w-24"
              />
              <h3 className="text-lg font-bold sm:text-xl">{member.name}</h3>
              <p className="mt-2 text-sm text-cyan-400 sm:text-base">
                {roleLabel}: {member.role}
              </p>

              <button
                onClick={() => setSelectedMember(member)}
                className="mt-4 w-full rounded-lg border border-cyan-500/30 px-4 py-2 text-sm transition hover:bg-cyan-500/10 sm:w-auto"
              >
                {teamText.viewProfile}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div
            className={`max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl p-6 sm:p-8 ${
              theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-slate-900"
            }`}
          >
            <img
              src={selectedMember.image}
              alt={selectedMember.name}
              className="mb-4 h-24 w-24 rounded-full border border-cyan-500/30 object-cover sm:h-28 sm:w-28"
            />
            <h2 className="mb-2 text-xl font-bold sm:text-2xl">{selectedMember.name}</h2>
            <p className="mb-4 text-cyan-400">
              {roleLabel}: {selectedMember.role}
            </p>

            <p className="mb-4 text-sm leading-7 sm:text-base">{selectedMember.bio}</p>

            <div className="mb-4">
              <h3 className="mb-2 font-semibold text-cyan-400">{teamText.skills}</h3>
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

            <p className="mb-6 break-all text-sm sm:text-base">
              <span className="font-semibold text-cyan-400">{teamText.contact}: </span>
              {selectedMember.email}
            </p>

            <button
              onClick={() => setSelectedMember(null)}
              className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-black sm:w-auto"
            >
              {teamText.close}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}