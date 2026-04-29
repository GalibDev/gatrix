import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    projects: 0,
    team: 0,
    messages: 0,
    achievements: 0,
  });

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/admin/login");
  }

  async function fetchStats() {
    const { count: projects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    const { count: team } = await supabase
      .from("team_members")
      .select("*", { count: "exact", head: true });

    const { count: messages } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true });

    const { count: achievements } = await supabase
      .from("achievements")
      .select("*", { count: "exact", head: true });

    setStats({
      projects: projects || 0,
      team: team || 0,
      messages: messages || 0,
      achievements: achievements || 0,
    });
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-wide">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your website content from one place
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex w-fit rounded-xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-400"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">
            <h3 className="text-lg text-slate-400">Projects</h3>
            <p className="text-3xl font-bold text-cyan-400">
              {stats.projects}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">
            <h3 className="text-lg text-slate-400">Team</h3>
            <p className="text-3xl font-bold text-cyan-400">{stats.team}</p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">
            <h3 className="text-lg text-slate-400">Messages</h3>
            <p className="text-3xl font-bold text-cyan-400">
              {stats.messages}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">
            <h3 className="text-lg text-slate-400">Achievements</h3>
            <p className="text-3xl font-bold text-cyan-400">
              {stats.achievements}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Link
            to="/admin/projects"
            className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
          >
            <div className="mb-4 text-4xl">📁</div>
            <h2 className="text-2xl font-bold text-cyan-400">Projects</h2>
            <p className="mt-2 text-slate-300">
              Add, edit, and delete project cards.
            </p>
          </Link>






<Link
  to="/admin/hero-slider"
  className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
>
  <div className="mb-4 text-4xl">🖼️</div>
  <h2 className="text-2xl font-bold text-cyan-400">Hero Slider</h2>
  <p className="mt-2 text-slate-300">
    Manage hero images, arrows, and slide timing.
  </p>
</Link>









<Link
  to="/admin/settings"
  className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
>
  <div className="mb-4 text-4xl">⚙️</div>
  <h2 className="text-2xl font-bold text-cyan-400">Settings</h2>
  <p className="mt-2 text-slate-300">
    Change website logo and settings.
  </p>
</Link>







<Link
  to="/admin/gallery"
  className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
>
  <div className="mb-4 text-4xl">🖼️</div>
  <h2 className="text-2xl font-bold text-cyan-400">Gallery</h2>
  <p className="mt-2 text-slate-300">
    Add, edit, delete and reorder gallery images.
  </p>
</Link>







<Link
  to="/admin/hero-content"
  className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
>
  <div className="mb-4 text-4xl">✍️</div>
  <h2 className="text-2xl font-bold text-cyan-400">Hero Content</h2>
  <p className="mt-2 text-slate-300">
    Edit hero badge, title, typing text, subtitle, and buttons.
  </p>
</Link>







{/* 28april chatbot */}

<Link
  to="/admin/ai-faqs"
  className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
>
  <div className="mb-4 text-4xl">🤖</div>
  <h2 className="text-2xl font-bold text-cyan-400">AI Assistant FAQ</h2>
  <p className="mt-2 text-slate-300">
    Add, edit, delete assistant questions and answers.
  </p>
</Link>






<Link
  to="/admin/birthday"
  className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(255,0,150,0.12)]"
>
  <div className="mb-4 text-4xl">🎂</div>
  <h2 className="text-2xl font-bold text-pink-400">Birthday Settings</h2>
  <p className="mt-2 text-slate-300">
    Manage birthday celebration popup and photo.
  </p>
</Link>










<Link
  to="/admin/notice"
  className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(255,0,150,0.12)]"
>
  <div className="mb-4 text-4xl">📢</div>
  <h2 className="text-2xl font-bold text-pink-400">Notice Settings</h2>
  <p className="mt-2 text-slate-300">
    Edit website top notice bar.
  </p>
</Link>




















          <Link
            to="/admin/team"
            className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
          >
            <div className="mb-4 text-4xl">👥</div>
            <h2 className="text-2xl font-bold text-cyan-400">Team</h2>
            <p className="mt-2 text-slate-300">Manage team members.</p>
          </Link>

          <Link
            to="/admin/messages"
            className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
          >
            <div className="mb-4 text-4xl">✉️</div>
            <h2 className="text-2xl font-bold text-cyan-400">Messages</h2>
            <p className="mt-2 text-slate-300">View contact form messages.</p>
          </Link>

          <Link
            to="/admin/achievements"
            className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
          >
            <div className="mb-4 text-4xl">🏆</div>
            <h2 className="text-2xl font-bold text-cyan-400">
              Achievements
            </h2>
            <p className="mt-2 text-slate-300">
              Add, edit, and delete achievements & events.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}