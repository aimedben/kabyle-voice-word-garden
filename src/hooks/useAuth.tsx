import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "validator" | "contributor";

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  country: string | null;
  native_speaker: boolean;
  gender: string | null;
  age_group: string | null;
  region_id: string | null;
  dialect_id: string | null;
  points: number;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  isReviewer: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id ?? null;

  async function loadUserData(id: string) {
    const [{ data: profileData }, { data: roleData }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", id),
    ]);
    setProfile((profileData as Profile | null) ?? null);
    setRoles(((roleData ?? []) as { role: AppRole }[]).map((r) => r.role));
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setProfile(null);
        setRoles([]);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    void loadUserData(userId);
  }, [userId]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      roles,
      loading,
      isAdmin: roles.includes("admin"),
      isReviewer: roles.includes("admin") || roles.includes("validator"),
      refreshProfile: async () => {
        if (userId) await loadUserData(userId);
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, profile, roles, loading, userId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
