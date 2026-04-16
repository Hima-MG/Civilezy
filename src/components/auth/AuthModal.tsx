"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// ---------------------------------------------------------------------------
// AuthModal — Premium dark/orange themed Login / Signup modal
// ---------------------------------------------------------------------------
export default function AuthModal() {
  const { signup, login } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (m: "login" | "signup") => {
    setMode(m);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    // Validation
    if (mode === "signup" && !displayName.trim()) {
      setError("Display name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(email.trim(), password, displayName.trim());
      } else {
        await login(email.trim(), password);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      const map: Record<string, string> = {
        "auth/email-already-in-use": "This email is already registered. Try logging in.",
        "auth/invalid-email": "Invalid email address.",
        "auth/weak-password": "Password is too weak. Use at least 6 characters.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-credential": "Invalid email or password.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
      };
      setError(map[code] || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-700/50 bg-zinc-900 shadow-2xl shadow-black/50 overflow-hidden"
        style={{ animation: "heroFadeUp 0.4s ease forwards" }}
      >
        {/* Header */}
        <div className="px-6 pt-7 pb-4 text-center">
          <h2 className="text-2xl font-extrabold text-white font-[Rajdhani]">
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Game Arena
            </span>
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {mode === "login" ? "Welcome back! Login to continue." : "Create your account to start playing."}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex mx-6 mb-5 bg-zinc-800/60 rounded-xl p-1">
          {(["login", "signup"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => switchMode(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                mode === tab
                  ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-7 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                maxLength={30}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5 text-rose-400 text-sm font-medium">
              <span className="shrink-0">!</span>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : (
              <>{mode === "login" ? "Login" : "Create Account"}</>
            )}
          </button>

          {/* Switch mode text */}
          <p className="text-center text-zinc-500 text-sm">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => switchMode("signup")} className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => switchMode("login")} className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                  Login
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
