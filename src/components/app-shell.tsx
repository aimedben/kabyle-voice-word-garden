import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Database,
  Download,
  LayoutDashboard,
  Mic,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/site-header";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/read", label: "Read & record", icon: Mic },
  { to: "/upload", label: "Upload audio", icon: Upload },
  { to: "/explorer", label: "Dataset explorer", icon: Database },
  { to: "/profile", label: "My profile", icon: User },
] as const;

const REVIEWER_NAV = [
  { to: "/validate", label: "Validation queue", icon: ShieldCheck },
  { to: "/research", label: "Research analytics", icon: BarChart3 },
  { to: "/export", label: "Dataset export", icon: Download },
] as const;

const ADMIN_NAV = [{ to: "/admin", label: "Administration", icon: Sparkles }] as const;

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { isReviewer, isAdmin } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-5 py-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-6">
            <NavGroup items={NAV} pathname={pathname} />
            {isReviewer && <NavGroup label="Review" items={REVIEWER_NAV} pathname={pathname} />}
            {isAdmin && <NavGroup label="Admin" items={ADMIN_NAV} pathname={pathname} />}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-extrabold md:text-3xl">{title}</h1>
              {description && (
                <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {actions}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label?: string;
  items: readonly { to: string; label: string; icon: typeof Mic }[];
  pathname: string;
}) {
  return (
    <div>
      {label && (
        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </p>
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-card hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
