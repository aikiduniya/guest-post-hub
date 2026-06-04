import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/layout/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Log in or sign up — Accessily" }, { name: "robots", content: "noindex" }],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email().max(255);
const passSchema = z.string().min(6).max(72);

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/admin" });
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(fd.get("email"));
    const password = passSchema.safeParse(fd.get("password"));
    if (!email.success || !password.success) {
      toast.error("Invalid email or password (min 6 chars).");
      setLoading(false);
      return;
    }
    if (mode === "signup") {
      const full_name = String(fd.get("full_name") || "").trim().slice(0, 100);
      const { error } = await supabase.auth.signUp({
        email: email.data,
        password: password.data,
        options: { emailRedirectTo: `${window.location.origin}/admin`, data: { full_name } },
      });
      if (error) toast.error(error.message);
      else toast.success("Account created — check your inbox if confirmation is enabled.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.data,
        password: password.data,
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Welcome back!");
        navigate({ to: "/admin" });
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 gradient-orb bg-cyan-brand rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 gradient-orb bg-primary rounded-full"></div>

      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-10 shadow-glow">
        <Link to="/" className="inline-block mb-8">
          <Logo className="h-9 w-auto" />
        </Link>
        <h1 className="font-display text-3xl font-bold mb-2">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {mode === "login" ? "Log in to manage your campaigns." : "Get started in under a minute."}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              name="full_name"
              placeholder="Full name"
              maxLength={100}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
            />
          )}
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Password"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
          />
          <button
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-glow hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 text-sm text-muted-foreground hover:text-primary w-full text-center"
        >
          {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}
