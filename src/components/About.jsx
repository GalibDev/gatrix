export default function About({ about, theme }) {
  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-3xl font-bold text-cyan-400">
          {about.title}
        </h2>

        <div
          className={`rounded-3xl border p-8 ${
            theme === "dark"
              ? "border-cyan-500/20 bg-slate-900"
              : "border-slate-300 bg-white"
          }`}
        >
          <p className="text-lg leading-8">{about.desc}</p>
        </div>
      </div>
    </section>
  );
}