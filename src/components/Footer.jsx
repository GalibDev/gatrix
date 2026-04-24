import { FaFacebookF, FaGithub, FaYoutube } from "react-icons/fa";

export default function Footer({ footer, theme }) {
  return (
    <footer
      className={`border-t px-4 py-10 sm:px-6 ${
        theme === "dark"
          ? "border-cyan-500/20 bg-slate-950"
          : "border-slate-300 bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <h3 className="logo-font text-2xl font-bold text-cyan-400">GATRIX</h3>
          <p className="mt-2 max-w-md text-sm text-slate-400">{footer.text}</p>
          <p className="mt-2 text-xs text-slate-500">
            © 2026 GATRIX. {footer.rights}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xl">
          <a
            href="#"
            className="rounded-full border border-cyan-500/30 p-3 transition hover:bg-cyan-500/10 hover:text-cyan-400"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            className="rounded-full border border-cyan-500/30 p-3 transition hover:bg-cyan-500/10 hover:text-cyan-400"
          >
            <FaGithub />
          </a>
          <a
            href="#"
            className="rounded-full border border-cyan-500/30 p-3 transition hover:bg-cyan-500/10 hover:text-cyan-400"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );






}