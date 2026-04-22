import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact({ contact, theme }) {
  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setFailed(false);

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        {
          publicKey: "YOUR_PUBLIC_KEY",
        }
      )
      .then(() => {
        setSubmitted(true);
        setLoading(false);
        formRef.current.reset();
      })
      .catch(() => {
        setFailed(true);
        setLoading(false);
      });
  };

  return (
    <section id="contact" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-3xl font-bold text-cyan-400">{contact.title}</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div
            className={`rounded-3xl border p-6 sm:p-8 ${
              theme === "dark"
                ? "border-cyan-500/20 bg-slate-900"
                : "border-slate-300 bg-white"
            }`}
          >
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-cyan-400">{contact.email}</h3>
              <p className="break-all">gatrix@gmail.com</p>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-cyan-400">{contact.location}</h3>
              <p>Bangladesh</p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-cyan-400">{contact.facebook}</h3>
              <p className="break-all">facebook.com/gatrix</p>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={sendEmail}
            className={`rounded-3xl border p-6 sm:p-8 ${
              theme === "dark"
                ? "border-cyan-500/20 bg-slate-900"
                : "border-slate-300 bg-white"
            }`}
          >
            <h3 className="mb-6 text-xl font-semibold text-cyan-400">
              {contact.formTitle}
            </h3>

            <input
              type="text"
              name="user_name"
              placeholder={contact.name}
              required
              className={`mb-4 w-full rounded-xl border px-4 py-3 outline-none ${
                theme === "dark"
                  ? "border-cyan-500/20 bg-slate-950 text-white"
                  : "border-slate-300 bg-slate-100 text-slate-900"
              }`}
            />

            <input
              type="email"
              name="user_email"
              placeholder={contact.emailPlaceholder || "Your Email"}
              required
              className={`mb-4 w-full rounded-xl border px-4 py-3 outline-none ${
                theme === "dark"
                  ? "border-cyan-500/20 bg-slate-950 text-white"
                  : "border-slate-300 bg-slate-100 text-slate-900"
              }`}
            />

            <textarea
              name="message"
              placeholder={contact.message}
              required
              rows="5"
              className={`mb-4 w-full rounded-xl border px-4 py-3 outline-none ${
                theme === "dark"
                  ? "border-cyan-500/20 bg-slate-950 text-white"
                  : "border-slate-300 bg-slate-100 text-slate-900"
              }`}
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:scale-[1.02] hover:shadow-[0_0_20px_#22d3ee] sm:w-auto disabled:opacity-70"
            >
              {loading ? "Sending..." : contact.send}
            </button>

            {submitted && (
              <p className="mt-4 text-sm text-cyan-400">{contact.success}</p>
            )}

            {failed && (
              <p className="mt-4 text-sm text-red-400">
                Failed to send message. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}