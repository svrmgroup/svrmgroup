import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import Logo from "@/components/svrm/Logo";

const AdminLogin = () => {
  const { session, isAdmin, loading } = useAdminAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) nav("/admin", { replace: true });
  }, [loading, session, isAdmin, nav]);

  if (loading) return null;
  if (session && isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Ask the site owner to grant admin access.");
      setMode("signin");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in.");
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <Seo title="Admin · SVRM" description="Admin console" path="/admin/login" />
      <div className="w-full max-w-md bg-surface-raised border border-border/40 p-10">
        <p className="eyebrow">SVRM</p>
        <h1 className="font-serif text-3xl mt-3">Admin console</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {mode === "signin" ? "Sign in to manage enquiries." : "Create your admin account."}
        </p>

        {session && !isAdmin && (
          <div className="mt-6 border border-destructive/50 bg-destructive/5 p-4 text-xs text-destructive">
            You are signed in but not authorised as an admin. Contact the site owner.
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-2 w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full px-6 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-[0.28em] hover:bg-primary-glow transition-colors disabled:opacity-60"
          >
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-xs text-muted-foreground hover:text-gold transition-colors"
        >
          {mode === "signin" ? "Need to create an account?" : "Have an account? Sign in"}
        </button>
      </div>
    </main>
  );
};

export default AdminLogin;
