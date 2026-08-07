import { type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

/**
 * Client-side gate for contributor pages. Server access is independently
 * enforced by row level security on every table.
 */
export function RequireAuth({
  children,
  reviewer = false,
  admin = false,
}: {
  children: ReactNode;
  reviewer?: boolean;
  admin?: boolean;
}) {
  const { session, loading, isReviewer, isAdmin, roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/auth", replace: true });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const rolesLoaded = roles.length > 0;
  const denied = (admin && !isAdmin) || (reviewer && !isReviewer);

  if (denied && rolesLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-5 py-32 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground" />
          <h1 className="mt-4 text-xl font-bold">Restricted area</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This section is reserved for {admin ? "administrators" : "validators"}. Ask a platform
            administrator to grant you the role.
          </p>
          <Button asChild className="mt-6 rounded-xl">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
