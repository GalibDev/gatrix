export default function Achievements({ title, items, theme }) {
  return (
    <section id="achievements" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-bold text-cyan-400">{title}</h2>

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl border p-5 transition hover:-translate-y-1 hover:shadow-[0_0_20px_#22d3ee] sm:p-6 ${
                theme === "dark"
                  ? "border-cyan-500/20 bg-slate-900"
                  : "border-slate-300 bg-white"
              }`}
            >
              <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-bold sm:text-xl">{item.title}</h3>
                <span className="w-fit rounded-full border border-cyan-500/30 px-3 py-1 text-xs text-cyan-400 sm:text-sm">
                  {item.date}
                </span>
              </div>

              <p className="mb-2 text-sm text-cyan-400 sm:text-base">{item.subtitle}</p>
              <p className="text-sm leading-7 text-slate-400 sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}