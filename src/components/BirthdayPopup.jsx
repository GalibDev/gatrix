import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function BirthdayPopup() {
  const [birthday, setBirthday] = useState(null);
  const [show, setShow] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    fetchBirthday();
  }, []);

  async function fetchBirthday() {
    const { data, error } = await supabase
      .from("birthday_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data || !data.is_active) return;

    const now = new Date();
    const todayMonth = now.getMonth() + 1;
    const todayDay = now.getDate();

    



const isBirthday =
      todayMonth === Number(data.birth_month) &&
      todayDay === Number(data.birth_day);






    if (isBirthday) {
      setBirthday(data);
      setShow(true);
      createConfetti();
    }
  }

  function createConfetti() {
    const pieces = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 3,
      size: 6 + Math.random() * 8,
    }));

    setConfetti(pieces);
  }

  if (!show || !birthday) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-black/75 px-4 backdrop-blur-md">
      {confetti.map((item) => (
        <span
          key={item.id}
          className="absolute top-[-20px] rounded-sm bg-pink-400"
          style={{
            left: `${item.left}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animation: `birthdayFall ${item.duration}s linear ${item.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-pink-400/30 bg-slate-950 p-6 text-center text-white shadow-[0_0_45px_rgba(255,0,150,0.35)]">
        {birthday.photo_url && (
          <img
            src={birthday.photo_url}
            alt={birthday.name}
            className="mx-auto mb-5 h-40 w-40 rounded-full border-4 border-pink-400 object-cover object-top shadow-[0_0_30px_rgba(255,0,150,0.5)]"
          />
        )}

        <p className="mb-2 text-5xl">🎂</p>

        <h2 className="text-3xl font-extrabold text-pink-400">
          Happy Birthday
        </h2>

        <h3 className="mt-2 text-2xl font-bold">{birthday.name}</h3>

        {birthday.role && (
          <p className="mt-1 text-sm text-slate-400">{birthday.role}</p>
        )}

        <p className="mt-5 leading-7 text-slate-200">{birthday.message}</p>

        <button
          onClick={() => setShow(false)}
          className="mt-6 rounded-xl bg-pink-400 px-6 py-3 font-bold text-slate-950 transition hover:scale-105"
        >
          Celebrate 🎉
        </button>
      </div>
    </div>
  );
}