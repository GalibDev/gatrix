import { useEffect, useState } from "react";

export default function Hero({ hero, theme, heroImages }) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    let i = 0;
    const current = hero.typing[index];
    const interval = setInterval(() => {
      setText(current.slice(0, i));
      i++;
      if (i > current.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % hero.typing.length);
        }, 1200);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [index, hero.typing]);

  useEffect(() => {
    if (!heroImages || heroImages.length === 0) return;

    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(imageInterval);
  }, [heroImages]);

  const prevSlide = () => {
    setCurrentImage((prev) =>
      prev === 0 ? heroImages.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 sm:px-6"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-4 top-16 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl sm:left-10 sm:top-20 sm:h-72 sm:w-72"></div>
        <div className="absolute right-4 top-24 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl sm:right-10 sm:top-32 sm:h-72 sm:w-72"></div>
        <div className="absolute bottom-10 left-1/3 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl sm:h-56 sm:w-56"></div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]"></div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="text-center md:text-left">
          <p className="mb-4 inline-block rounded-full border border-cyan-400/30 px-3 py-2 text-xs text-cyan-400 sm:px-4 sm:text-sm">
            {hero.badge}
          </p>

          <h1 className="mb-5 text-3xl font-extrabold leading-tight sm:text-5xl md:text-7xl">
            {hero.title}
          </h1>

          <p className="mb-3 min-h-[48px] text-base font-medium text-cyan-400 sm:min-h-[40px] sm:text-lg md:text-2xl">
            {text}
          </p>

          <p
            className={`mx-auto mb-8 max-w-2xl text-sm leading-7 sm:text-base md:mx-0 md:text-lg ${
              theme === "dark" ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {hero.subtitle}
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="#projects"
              className="inline-block w-full rounded-xl bg-cyan-500 px-6 py-3 text-center font-semibold text-black transition hover:scale-105 hover:shadow-[0_0_20px_#22d3ee] sm:w-auto"
            >
              {hero.btn}
            </a>

            <a
              href="#team"
              className="inline-block w-full rounded-xl border border-cyan-500/30 px-6 py-3 text-center font-semibold transition hover:bg-cyan-500/10 sm:w-auto"
            >
              Meet Team
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-[320px] sm:max-w-sm md:max-w-md">
            <div className="absolute -inset-2 rounded-[2rem] bg-cyan-500/20 blur-2xl"></div>
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/20 blur-3xl"></div>

            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-white/5 shadow-[0_0_30px_rgba(34,211,238,0.18)] backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"></div>

              {heroImages.map((img, imgIndex) => (
                <img
                  key={imgIndex}
                  src={img}
                  alt={`GATRIX Group ${imgIndex + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-1000 ${
                    imgIndex === currentImage
                      ? "translate-y-0 scale-100 opacity-100"
                      : "translate-y-1 scale-105 opacity-0"
                  }`}
                />
              ))}

              <div className="relative aspect-[4/5] w-full animate-[float_5s_ease-in-out_infinite]"></div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>

              <div className="absolute bottom-4 left-4 rounded-full border border-cyan-400/30 bg-slate-950/70 px-4 py-2 text-xs text-cyan-300 backdrop-blur-md sm:text-sm">
                GATRIX Team
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_#22d3ee]"
                aria-label="Previous slide"
              >
                ‹
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_#22d3ee]"
                aria-label="Next slide"
              >
                ›
              </button>

              <div className="absolute bottom-4 right-4 flex gap-2">
                {heroImages.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => setCurrentImage(dotIndex)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      dotIndex === currentImage
                        ? "bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                        : "bg-white/40"
                    }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}