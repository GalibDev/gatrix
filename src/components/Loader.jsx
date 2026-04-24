import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let current = 0;

    const progressTimer = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(progressTimer);
        setTimeout(() => {
          setFadeOut(true);
        }, 100);
      }
      setProgress(current);
    }, 120);

    return () => clearInterval(progressTimer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 transition-opacity duration-300 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center px-6 text-center">
        <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/10 blur-2xl"></div>

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-cyan-500/80 border-t-transparent shadow-[0_0_25px_#22d3ee]"></div>

          <div className="absolute inset-3 rounded-full border border-cyan-400/30 bg-slate-900/70 backdrop-blur-md"></div>

          <div className="absolute flex h-10 w-16 items-center justify-center gap-3 rounded-full border border-cyan-400/20 bg-slate-950/80">
            <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]"></span>
            <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] [animation-delay:200ms]"></span>
          </div>
        </div>

        <h1 className="logo-font animate-pulse text-3xl font-bold tracking-[0.35em] text-cyan-400 sm:text-4xl">
          GATRIX
        </h1>

        <p className="mt-3 text-sm text-slate-400 sm:text-base">
          Initializing Robotics Interface...
        </p>

        <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-slate-800 sm:w-80">
          <div
            className="h-full rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="mt-3 text-xs font-medium tracking-widest text-cyan-300 sm:text-sm">
          {progress}%
        </p>
      </div>
    </div>
  );
}