import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Messages() {
  const [messages, setMessages] = useState([]);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setMessages(data || []);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function markAsRead(id) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchMessages();
  }

  async function deleteMessage(id) {
    const ok = window.confirm("Delete this message?");
    if (!ok) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchMessages();
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Messages</h1>
            <p className="mt-2 text-slate-400">
              View contact form submissions.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="w-fit rounded-xl border border-cyan-500/30 px-5 py-3 font-semibold text-cyan-300 hover:bg-cyan-500/10"
          >
            Back to Dashboard
          </Link>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
            No messages found.
          </div>
        ) : (
          <div className="grid gap-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-3xl border p-6 ${
                  msg.is_read
                    ? "border-slate-800 bg-slate-900"
                    : "border-cyan-500/30 bg-slate-900 shadow-[0_0_25px_rgba(34,211,238,0.08)]"
                }`}
              >
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{msg.name}</h2>
                    <p className="text-cyan-400">{msg.email}</p>
                  </div>

                  <div className="text-sm text-slate-400">
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>

                <p className="mb-5 leading-7 text-slate-300">{msg.message}</p>

                <div className="flex flex-wrap gap-3">
                  {!msg.is_read && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white hover:bg-emerald-400"
                    >
                      Mark as Read
                    </button>
                  )}

                  <a
                    href={`mailto:${msg.email}`}
                    className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300"
                  >
                    Reply
                  </a>

                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="rounded-xl bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}