import { useEffect, useState } from "react";

export default function Hero({
  hero,
  theme,
  heroImages = [],
  slideInterval = 5000,
  showArrows = true,
}) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  // ✅ Smooth scroll
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // ✅ Typing animation (stable)
  useEffect(() => {
    let i = 0;
    const current = hero.typing[index];

    setText(""); // reset

    const interval = setInterval(() => {
      setText(current.slice(0, i));
      i++;

      if (i > current.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % hero.typing.length);
        }, 1500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [index, hero.typing]);

  // ✅ Image slider
  useEffect(() => {
    if (!heroImages || heroImages.length <= 1) return;

    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, Number(slideInterval) || 5000);

    return () => clearInterval(imageInterval);
  }, [heroImages, slideInterval]);

  function prevSlide() {
    if (!heroImages.length) return;
    setCurrentImage((prev) =>
      prev === 0 ? heroImages.length - 1 : prev - 1
    );
  }

  function nextSlide() {
    if (!heroImages.length) return;
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  }

  function handleTouchStart(e) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e) {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();

    setTouchStart(null);
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 sm:px-6"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-4 top-16 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl sm:h-72 sm:w-72"></div>
        <div className="absolute right-4 top-24 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl sm:h-72 sm:w-72"></div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        
        {/* LEFT CONTENT */}
        <div className="text-center md:text-left">
          <p className="mb-4 inline-block rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-400">
            {hero.badge}
          </p>

          <h1 className="mb-5 text-3xl font-extrabold sm:text-5xl md:text-7xl">
            {hero.title}
          </h1>

          {/* ✅ FIXED BLINK ISSUE */}
          <p className="mb-3 min-h-[48px] text-cyan-400 text-lg md:text-2xl">
            {text}
          </p>

          <p
            className={`mb-8 text-sm md:text-lg ${
              theme === "dark" ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {hero.subtitle}
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            
            {/* ✅ FIXED BUTTON */}
            <button
              onClick={() => scrollTo("projects")}
              className="inline-block w-full rounded-xl bg-cyan-500 px-6 py-3 text-center font-semibold text-black transition hover:scale-105 hover:shadow-[0_0_20px_#22d3ee] sm:w-auto"
            >
              {hero.btn}
            </button>

            {/* ✅ FIXED BUTTON */}
            <button
              onClick={() => scrollTo("team")}
              className="inline-block w-full rounded-xl border border-cyan-500/30 px-6 py-3 text-center font-semibold transition hover:bg-cyan-500/10 sm:w-auto"
            >
              Meet Team
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[320px] sm:max-w-sm md:max-w-md">
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative overflow-hidden rounded-[2rem]"
            >
              {heroImages.map((img, imgIndex) => (
                <img
                  key={imgIndex}
                  src={img}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition ${
                    imgIndex === currentImage
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
              ))}

              <div className="aspect-[4/5] w-full"></div>

              {showArrows && heroImages.length > 1 && (
                <>
                  <button onClick={prevSlide}>‹</button>
                  <button onClick={nextSlide}>›</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}