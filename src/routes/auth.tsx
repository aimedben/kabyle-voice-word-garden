import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Mode = "login" | "register";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } => ({
    mode: search["mode"] === "register" ? "register" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — KabyleVoice" },
      {
        name: "description",
        content:
          "Sign in or create a KabyleVoice contributor account to record, validate and explore the Kabyle speech corpus.",
      },
      { property: "og:title", content: "Sign in — KabyleVoice" },
      {
        property: "og:description",
        content: "Access the KabyleVoice Kabyle speech research platform.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<Mode>(search.mode === "register" ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName.trim() || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          toast.success("Check your email to confirm your account.");
          return;
        }
        toast.success("Welcome to KabyleVoice.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success("Signed in.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-hero relative hidden flex-col justify-between p-12 lg:flex">
        <div className="grid-noise pointer-events-none absolute inset-0" aria-hidden />
        <Logo />
        <div className="relative max-w-md">
          <h2 className="font-display text-3xl leading-tight font-extrabold text-balance">
            Every validated clip makes Kabyle a little more machine-readable.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Contributors record, validators verify, researchers export. The corpus grows with a
            complete audit trail behind every second of audio.
          </p>
        </div>
        <p className="relative text-xs text-muted-foreground">
          Academic research platform · Taqbaylit speech corpus
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>

          <h1 className="mt-8 text-2xl font-bold">
            {mode === "register" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "register"
              ? "Join the contributors building the Kabyle speech corpus."
              : "Sign in to continue contributing."}
          </p>

          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as Mode);
              setSent(false);
            }}
            className="mt-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </Tabs>

          {sent ? (
            <Card className="mt-6 rounded-2xl shadow-card">
              <CardContent className="p-6 text-sm leading-relaxed">
                We sent a confirmation link to <strong>{email}</strong>. Open it to activate your
                contributor account, then come back and sign in.
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tanina A."
                    maxLength={60}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "register" ? "Create account" : "Sign in"}
              </Button>
            </form>
          )}

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl"
            onClick={handleGoogle}
            disabled={busy}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Back to the project overview
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.96 1 12 1a11 11 0 0 0-9.82 6.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51Z"
      />
    </svg>
  );
}
