"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// ---------------------------------------------------------------------------
// Eye icons (inline SVG to avoid extra dependencies)
// ---------------------------------------------------------------------------
function EyeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// AuthModal — Premium dark/orange themed Login / Signup modal
// ---------------------------------------------------------------------------
export default function AuthModal() {
  const { signup, login, resetPassword } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const switchMode = (m: "login" | "signup" | "forgot") => {
    setMode(m);
    setError("");
    setResetSent(false);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    // Forgot password flow
    if (mode === "forgot") {
      if (!email.trim()) { setError("Email is required"); return; }
      setLoading(true);
      try {
        await resetPassword(email.trim());
        setResetSent(true);
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code ?? "";
        const map: Record<string, string> = {
          "auth/user-not-found": "No account found with this email.",
          "auth/invalid-email": "Invalid email address.",
          "auth/too-many-requests": "Too many attempts. Please try again later.",
        };
        setError(map[code] || "Failed to send reset email. Please try again.");
      } finally { setLoading(false); }
      return;
    }

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
            {mode === "login" && "Welcome back! Login to continue."}
            {mode === "signup" && "Create your account to start playing."}
            {mode === "forgot" && "Reset your password to regain access."}
          </p>
        </div>

        {/* Tab switch — only show for login/signup */}
        {mode !== "forgot" && (
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
        )}

        {/* Forgot password — back button */}
        {mode === "forgot" && (
          <div className="mx-6 mb-5">
            <button
              onClick={() => switchMode("login")}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
            >
              <span>←</span> Back to Login
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-7 space-y-4">
          {/* Display Name — signup only */}
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

          {/* Email */}
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

          {/* Password — login & signup only */}
          {mode !== "forgot" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-[18px] h-[18px]" /> : <EyeIcon className="w-[18px] h-[18px]" />}
                </button>
              </div>

              {/* Forgot password link — login only */}
              {mode === "login" && (
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-xs text-orange-400/80 hover:text-orange-300 transition-colors font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reset sent success */}
          {mode === "forgot" && resetSent && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-emerald-400 text-sm font-medium">
              <span className="shrink-0">✓</span>
              Password reset email sent! Check your inbox.
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5 text-rose-400 text-sm font-medium">
              <span className="shrink-0">!</span>
              {error}
            </div>
          )}

          {/* Submit button */}
          {!(mode === "forgot" && resetSent) && (
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {mode === "login" ? "Logging in..." : mode === "signup" ? "Creating account..." : "Sending..."}
                </>
              ) : (
                <>{mode === "login" ? "Login" : mode === "signup" ? "Create Account" : "Send Reset Link"}</>
              )}
            </button>
          )}

          {/* Switch mode text */}
          {mode !== "forgot" && (
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
          )}
        </form>
      </div>
    </div>
  );
}
