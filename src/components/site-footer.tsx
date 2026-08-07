import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            An open scientific infrastructure for Kabyle (Taqbaylit) speech data. Built so that
            researchers, universities and communities can train speech and language models on a
            corpus that meets international standards.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Platform</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/read" className="hover:text-foreground">
                Sentence reading
              </Link>
            </li>
            <li>
              <Link to="/upload" className="hover:text-foreground">
                Upload audio
              </Link>
            </li>
            <li>
              <Link to="/explorer" className="hover:text-foreground">
                Dataset explorer
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Research</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/research" className="hover:text-foreground">
                Research dashboard
              </Link>
            </li>
            <li>
              <Link to="/export" className="hover:text-foreground">
                Dataset export
              </Link>
            </li>
            <li>
              <a href="#faq" className="hover:text-foreground">
                Data & ethics FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KabyleVoice Research Consortium.</p>
          <p>Corpus released for non-commercial academic research. Speaker consent required.</p>
        </div>
      </div>
    </footer>
  );
}
