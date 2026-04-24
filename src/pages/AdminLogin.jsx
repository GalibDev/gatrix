import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!supabase) {
      alert("Supabase config missing");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-cyan-500/20 bg-slate-900 p-6"
      >
        <h1 className="mb-6 text-2xl font-bold">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950"
        >
          Login
        </button>
      </form>
    </div>
  );
}