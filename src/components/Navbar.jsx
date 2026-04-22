import { useState } from "react";

export default function Navbar({
  nav,
  theme,
  setTheme,
  language,
  setLanguage,
  logo,
  activeSection,
}) {
  const [open, setOpen] = useState(false);

  const navItemClass = (section) =>
    `transition px-2 py-1 rounded-md ${
      activeSection === section
        ? "text-cyan-400"
        : theme === "dark"
        ? "text-white hover:text-cyan-400"
        : "text-slate-900 hover:text-cyan-500"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        theme === "dark"
          ? "border-cyan-500/20 bg-slate-950/80"
          : "border-slate-300 bg-white/80"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="#home" className="flex items-center gap-2 sm:gap-3">
          <img src={logo} alt="GATRIX Logo" className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
          <span className="logo-font text-xl font-bold text-cyan-400 sm:text-2xl">
            GATRIX
          </span>
        </a>

        <div className="hidden items-center gap-4 lg:flex">
          <a href="#home" className={navItemClass("home")}>{nav.home}</a>
          <a href="#about" className={navItemClass("about")}>{nav.about}</a>
          <a href="#team" className={navItemClass("team")}>{nav.team}</a>
          <a href="#projects" className={navItemClass("projects")}>{nav.projects}</a>
          <a href="#gallery" className={navItemClass("gallery")}>{nav.gallery}</a>
          <a href="#achievements" className={navItemClass("achievements")}>{nav.achievements}</a>
          <a href="#contact" className={navItemClass("contact")}>{nav.contact}</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden rounded-full border border-cyan-500/30 p-1 md:flex">
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-full px-3 py-1 text-sm ${
                language === "en"
                  ? "bg-cyan-500 text-black"
                  : theme === "dark"
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("bn")}
              className={`rounded-full px-3 py-1 text-sm ${
                language === "bn"
                  ? "bg-cyan-500 text-black"
                  : theme === "dark"
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              বাংলা
            </button>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full border border-cyan-500/30 px-3 py-2 text-sm transition hover:bg-cyan-500/10"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-md border border-cyan-500/30 px-3 py-2 lg:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div
          className={`space-y-3 px-4 pb-4 lg:hidden ${
            theme === "dark" ? "bg-slate-950/95" : "bg-white/95"
          }`}
        >
          <a href="#home" className="block rounded-lg px-2 py-2 hover:bg-cyan-500/10">{nav.home}</a>
          <a href="#about" className="block rounded-lg px-2 py-2 hover:bg-cyan-500/10">{nav.about}</a>
          <a href="#team" className="block rounded-lg px-2 py-2 hover:bg-cyan-500/10">{nav.team}</a>
          <a href="#projects" className="block rounded-lg px-2 py-2 hover:bg-cyan-500/10">{nav.projects}</a>
          <a href="#gallery" className="block rounded-lg px-2 py-2 hover:bg-cyan-500/10">{nav.gallery}</a>
          <a href="#achievements" className="block rounded-lg px-2 py-2 hover:bg-cyan-500/10">{nav.achievements}</a>
          <a href="#contact" className="block rounded-lg px-2 py-2 hover:bg-cyan-500/10">{nav.contact}</a>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setLanguage("en")}
              className="rounded-full border border-cyan-500/30 px-3 py-1 text-sm"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("bn")}
              className="rounded-full border border-cyan-500/30 px-3 py-1 text-sm"
            >
              বাংলা
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}