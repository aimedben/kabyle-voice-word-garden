import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8">
        <Logo />
        <p className="text-sm text-muted-foreground">Taqbaylit · Une variété de tamazight</p>
        <Link to="/read" className="text-sm text-primary">Lire sans compte</Link>
      </div>
    </footer>
  );
}
