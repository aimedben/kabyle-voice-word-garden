import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5">
        <Link to="/" aria-label="Accueil KabyleVoice"><Logo /></Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm"><Link to="/read"><BookOpen className="h-4 w-4" />Lire</Link></Button>
        </div>
      </div>
    </header>
  );
}
