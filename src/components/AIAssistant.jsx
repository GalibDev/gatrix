import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import aiGirl from "../assets/ai-girl.png";

export default function AIAssistant({ language = "en" }) {
  const storageKey = `evana_chat_${language}`;

  const welcomeText =
    language === "bn"
      ? "হ্যালো! আমি Evana AI। কী জানতে চাও?"
      : "Hi! I am Evana AI. How can I help you?";

  const quickButtons =
    language === "bn"
      ? ["GATRIX কী?", "টিম", "প্রজেক্ট", "যোগাযোগ"]
      : ["What is GATRIX?", "Team", "Projects", "Contact"];

  const [open, setOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [autoTip, setAutoTip] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [{ from: "bot", text: welcomeText }];
  });

  const chatRef = useRef(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setMessages(saved ? JSON.parse(saved) : [{ from: "bot", text: welcomeText }]);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    const timer = setTimeout(() => setAutoTip(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  async function fetchFaqs() {
    const { data, error } = await supabase
      .from("ai_faqs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!error && data) setFaqs(data);
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function similarity(a, b) {
    const aWords = normalize(a).split(" ").filter(Boolean);
    const bWords = normalize(b).split(" ").filter(Boolean);
    if (!aWords.length || !bWords.length) return 0;

    let matches = 0;

    aWords.forEach((word) => {
      if (
        bWords.some(
          (target) =>
            target === word ||
            target.includes(word) ||
            word.includes(target)
        )
      ) {
        matches += 1;
      }
    });

    return matches / Math.max(aWords.length, bWords.length);
  }

  function findAnswer(question) {
    const q = normalize(question);

    let bestMatch = null;
    let bestScore = 0;

    faqs.forEach((faq) => {
      const searchableText = [
        faq.question_en,
        faq.question_bn,
        faq.keywords,
      ]
        .filter(Boolean)
        .join(" ");

      const keywordScore = normalize(faq.keywords)
        .split(",")
        .map((item) => normalize(item))
        .filter(Boolean)
        .some((keyword) => q.includes(keyword) || keyword.includes(q))
        ? 1
        : 0;

      const questionScore = Math.max(
        similarity(q, faq.question_en),
        similarity(q, faq.question_bn),
        similarity(q, searchableText)
      );

      const score = Math.max(keywordScore, questionScore);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    });

    if (!bestMatch || bestScore < 0.25) {
      return language === "bn"
        ? "দুঃখিত, আমি এখনো এই প্রশ্নের উত্তর জানি না। Contact section থেকে GATRIX টিমের সাথে যোগাযোগ করতে পারো।"
        : "Sorry, I do not know the answer yet. Please contact the GATRIX team from the Contact section.";
    }

    return language === "bn"
      ? bestMatch.answer_bn || bestMatch.answer_en
      : bestMatch.answer_en || bestMatch.answer_bn;
  }

  function sendQuestion(questionText) {
    if (!questionText.trim() || typing) return;

    const userMessage = questionText.trim();
    const botAnswer = findAnswer(userMessage);

    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setTyping(true);

    const delay = Math.min(Math.max(botAnswer.length * 18, 700), 1800);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: botAnswer }]);
    }, delay);
  }

  function handleSend(e) {
    e.preventDefault();
    sendQuestion(input);
  }

  function clearChat() {
    const fresh = [{ from: "bot", text: welcomeText }];
    setMessages(fresh);
    localStorage.setItem(storageKey, JSON.stringify(fresh));
  }

  function openChat() {
    setOpen(true);
    setAutoTip(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openChat}
        className="fixed bottom-5 right-5 z-[999] group flex items-end gap-2"
      >
        <div className="max-w-[180px] rounded-2xl bg-pink-500 px-3 py-2 text-xs text-white shadow-lg">
          {autoTip
            ? language === "bn"
              ? "কিছু জানতে চাইলে আমাকে জিজ্ঞেস করো 💖"
              : "Ask me anything about GATRIX 💖"
            : language === "bn"
            ? "হাই! আমি Evana AI 💖"
            : "Hi! I am Evana AI 💖"}
        </div>

        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-pink-500/25 blur-xl animate-pulse"></span>

          <img
            src={aiGirl}
            alt="Evana AI"
            style={{ animation: "evanaFloat 3s ease-in-out infinite" }}
            className="relative z-10 h-24 w-24 object-contain drop-shadow-[0_0_20px_rgba(255,0,150,0.75)] transition-all duration-300 group-hover:scale-110"
          />
        </div>
      </button>

      {open && (
        <div className="fixed bottom-28 right-4 z-[999] w-[92vw] max-w-sm overflow-hidden rounded-3xl border border-pink-500/30 bg-slate-950 text-white shadow-[0_0_35px_rgba(255,0,150,0.28)]">
          <div className="flex items-center justify-between border-b border-pink-500/20 bg-slate-900 px-5 py-4">
            <div className="flex items-center gap-3">
              <img src={aiGirl} alt="Evana AI" className="h-10 w-10 object-contain" />

              <div>
                <h3 className="font-bold text-pink-400">Evana AI</h3>
                <p className="text-xs text-slate-400">
                  {typing ? "Typing..." : "FAQ Assistant"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearChat}
                className="rounded-full border border-pink-500/30 px-3 py-1 text-xs hover:bg-pink-500/10"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-pink-500/30 px-3 py-1 text-sm hover:bg-pink-500/10"
              >
                ✕
              </button>
            </div>
          </div>

          <div ref={chatRef} className="h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    msg.from === "user"
                      ? "bg-pink-400 text-slate-950"
                      : "bg-slate-800 text-slate-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-100">
                  <span>{language === "bn" ? "Evana লিখছে" : "Evana is typing"}</span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-400"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-400 [animation-delay:0.15s]"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-400 [animation-delay:0.3s]"></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-pink-500/20 bg-slate-900 px-3 pt-3">
            {quickButtons.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => sendQuestion(item)}
                disabled={typing}
                className="rounded-full border border-pink-500/30 px-3 py-1 text-xs text-pink-200 transition hover:bg-pink-500/10 disabled:opacity-60"
              >
                {item}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="flex gap-2 bg-slate-900 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={typing}
              placeholder={
                language === "bn" ? "প্রশ্ন লিখুন..." : "Ask a question..."
              }
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-pink-400 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={typing}
              className="rounded-xl bg-pink-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-60"
            >
              {language === "bn" ? "পাঠান" : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}