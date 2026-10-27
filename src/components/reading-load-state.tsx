import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "./site-header";

export function ReadingLoadError() {
  const router = useRouter();
  const boundary = useQueryErrorResetBoundary();
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-6xl px-5 py-16"><h1 className="font-display text-3xl font-semibold">KabyleVoice</h1><p role="alert" className="mt-4 text-muted-foreground">Impossible de charger les mots et phrases pour le moment.</p><Button className="mt-6" onClick={() => { boundary.reset(); void router.invalidate(); }}><RotateCw className="h-4 w-4" />Réessayer</Button></main></div>;
}

export function ReadingNotFound() {
  return <main className="px-5 py-16 text-center text-muted-foreground">Collection introuvable.</main>;
}