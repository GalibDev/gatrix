import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function NoticeBar({ language = "en" }) {
  const [notice, setNotice] = useState(null);
  const [closed, setClosed] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);

  useEffect(() => {
    fetchNotice();
  }, []);

  async function fetchNotice() {
    const { data, error } = await supabase
      .from("notice_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) return;

    if (data && data.is_active) {
      setNotice(data);

      if (data.sound_enabled && !soundPlayed) {
        const audio = new Audio("/sounds/notify.mp3");
        audio.volume = 0.45;
        audio.play().catch(() => {});
        setSoundPlayed(true);
      }
    }
  }

  if (!notice || closed) return null;

  const text =
    language === "bn"
      ? notice.text_bn?.trim() || notice.text_en
      : notice.text_en?.trim() || notice.text_bn;

  const marqueeText = (
    <span className="mx-10 inline-block">
      {text} &nbsp; ✨ &nbsp; {text} &nbsp; 💖 &nbsp; {text}
    </span>
  );

  return (
    <div className="sticky top-0 z-[999] border-b border-pink-400/30 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(255,0,150,0.25)]">
      <div className="relative flex items-center overflow-hidden py-2">
        <div className="notice-marquee whitespace-nowrap text-sm font-semibold tracking-wide">
          {notice.link ? (
            <a href={notice.link} target="_blank" rel="noreferrer">
              {marqueeText}
            </a>
          ) : (
            marqueeText
          )}
        </div>

        <button
          type="button"
          onClick={() => setClosed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/25 px-2 py-1 text-xs hover:bg-black/40"
        >
          ✕
        </button>
      </div>
    </div>
  );
}