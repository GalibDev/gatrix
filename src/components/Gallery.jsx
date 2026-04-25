import { useState } from "react";

export default function Gallery({ title, images, theme }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="gallery" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-bold text-cyan-400">{title}</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => {
            const imageSrc = image.src || image.image_url;

            return (
              <div
                key={image.id}
                onClick={() => setSelectedImage({ ...image, src: imageSrc })}
                className={`cursor-pointer overflow-hidden rounded-3xl border transition hover:scale-[1.03] hover:shadow-[0_0_20px_#22d3ee] ${
                  theme === "dark"
                    ? "border-cyan-500/20 bg-slate-900"
                    : "border-slate-300 bg-white"
                }`}
              >
                <img
                  src={imageSrc}
                  alt={image.title}
                  className="h-52 w-full object-cover sm:h-60 lg:h-64"
                />

                <div className="p-4">
                  <h3 className="text-sm font-semibold sm:text-base">
                    {image.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {images.length === 0 && (
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-8 text-center text-slate-400">
            No gallery images added yet.
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div
            className={`w-full max-w-3xl rounded-2xl p-4 sm:p-5 ${
              theme === "dark" ? "bg-slate-900" : "bg-white"
            }`}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-h-[70vh] w-full rounded-xl object-cover"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-bold text-cyan-400 sm:text-lg">
                {selectedImage.title}
              </h3>

              <button
                onClick={() => setSelectedImage(null)}
                className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-black sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}