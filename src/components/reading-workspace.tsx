import { useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen, Download, ExternalLink, Mic, Search, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WavRecorder } from "@/lib/audio";
import { filterReadingPrompts, type PromptKind } from "@/lib/reading-prompts";
import { readingPromptsQuery } from "@/lib/reading-prompts.query";
import heroImage from "@/assets/hero-waveform.jpg";

export function ReadingWorkspace() {
  const { data: readingPrompts } = useSuspenseQuery(readingPromptsQuery);
  const [kind, setKind] = useState<PromptKind>("phrase");
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [audio, setAudio] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const recorder = useRef<WavRecorder | null>(null);
  const mounted = useRef(true);
  const prompts = filterReadingPrompts(readingPrompts, kind, search);
  const current = prompts[index];

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; recorder.current?.cancel(); };
  }, []);
  useEffect(() => { return () => { if (audio) URL.revokeObjectURL(audio); }; }, [audio]);
  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  function resetAudio() { setAudio(null); setError(""); setSeconds(0); }
  function select(next: number) { resetAudio(); setIndex(next); }
  async function toggleRecording() {
    setBusy(true);
    setError("");
    try {
      if (recording) {
        const active = recorder.current;
        if (!active) return;
        const result = await active.stop();
        if (mounted.current) { setAudio(URL.createObjectURL(result.blob)); setRecording(false); }
      } else {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone indisponible dans ce navigateur.");
        resetAudio();
        const active = new WavRecorder();
        recorder.current = active;
        await active.start();
        if (!mounted.current) { active.cancel(); return; }
        setRecording(true);
      }
    } catch (err) {
      recorder.current?.cancel();
      if (mounted.current) {
        setRecording(false);
        setError(err instanceof DOMException && err.name === "NotAllowedError"
          ? "L’accès au microphone a été refusé. Autorisez-le dans votre navigateur pour enregistrer."
          : "Impossible de démarrer l’enregistrement. Vérifiez votre microphone.");
      }
    } finally { if (mounted.current) setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-9 md:py-12">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">Tamazight · Kabyle (Taqbaylit)</p>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">KabyleVoice</h1>
            <p className="mt-3 text-muted-foreground">Des mots, des phrases, votre voix.</p>
          </div>
          <span className="flex items-center gap-2 text-sm text-muted-foreground"><BookOpen className="h-4 w-4 text-primary" />Accès libre · Sans compte</span>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
          <Tabs value={kind} onValueChange={(value) => { if (recording || busy) return; setKind(value === "word" ? "word" : "phrase"); setIndex(0); resetAudio(); }}>
            <TabsList><TabsTrigger value="phrase" disabled={recording || busy}>Phrases</TabsTrigger><TabsTrigger value="word" disabled={recording || busy}>Mots</TabsTrigger></TabsList>
          </Tabs>
          <div className="relative w-full sm:w-80">
            <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
            <Input aria-label="Rechercher un mot ou une phrase" placeholder="Rechercher en kabyle ou en français…" className="pl-9" value={search} disabled={recording || busy} onChange={(e) => { setSearch(e.target.value); setIndex(0); resetAudio(); }} />
          </div>
        </div>

        <div className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <section aria-label="Lecture" className="min-w-0">
            {current ? (
              <>
                <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{kind === "word" ? "Mot" : "Phrase"} à lire</span><span className="font-mono">{index + 1} / {prompts.length}</span></div>
                <div className="flex min-h-52 flex-col items-center justify-center gap-5 py-10 text-center md:min-h-64">
                  <p lang="kab" className="max-w-full break-words font-display text-3xl leading-relaxed font-semibold md:text-4xl">{current.text}</p>
                  <p className="text-base text-muted-foreground">{current.translation}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button variant="outline" size="icon" title="Précédent" aria-label="Précédent" disabled={recording || busy || prompts.length < 2} onClick={() => select((index - 1 + prompts.length) % prompts.length)}><ArrowLeft className="h-4 w-4" /></Button>
                  <Button className="min-w-48" size="lg" disabled={busy} onClick={toggleRecording} variant={recording ? "destructive" : "default"}>
                    {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}{busy ? "Un instant…" : recording ? `Arrêter · ${seconds}s` : "Enregistrer ma voix"}
                  </Button>
                  <Button variant="outline" size="icon" title="Suivant" aria-label="Suivant" disabled={recording || busy || prompts.length < 2} onClick={() => select((index + 1) % prompts.length)}><ArrowRight className="h-4 w-4" /></Button>
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">Enregistrement local uniquement · Aucun audio envoyé</p>
                {error && <p role="alert" className="mt-4 text-center text-sm text-destructive">{error}</p>}
                {audio && <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-6">
                  <audio aria-label="Mon enregistrement" controls src={audio} className="max-w-full" />
                  <Button asChild variant="outline" size="icon"><a href={audio} download={`kabylevoice-${current.id}.wav`} aria-label="Télécharger l’enregistrement" title="Télécharger"><Download className="h-4 w-4" /></a></Button>
                  <Button variant="ghost" size="icon" aria-label="Supprimer l’enregistrement" title="Supprimer" onClick={resetAudio}><Trash2 className="h-4 w-4" /></Button>
                </div>}
                <a href={current.source} target="_blank" rel="noreferrer" className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary">Source : {current.sourceName}<ExternalLink className="h-3 w-3" /></a>
              </>
            ) : <div className="py-20 text-center"><Search className="mx-auto mb-4 h-6 w-6 text-muted-foreground" /><h2 className="font-semibold">Aucun résultat</h2><Button className="mt-4" variant="outline" onClick={() => setSearch("")}>Effacer la recherche</Button></div>}
          </section>

          <aside className="min-w-0 border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <img src={heroImage} alt="Visualisation d’un signal vocal" className="mb-6 hidden h-28 w-full rounded-lg object-cover lg:block" />
            <h2 className="mb-3 text-sm font-semibold">{kind === "word" ? "Mots" : "Phrases"} disponibles <span className="ml-1 text-muted-foreground">{prompts.length}</span></h2>
            <div className="grid max-h-80 gap-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-1">
              {prompts.map((prompt, i) => <Button key={prompt.id} variant={index === i ? "secondary" : "ghost"} disabled={recording || busy} className="h-auto min-h-11 justify-start whitespace-normal px-3 py-3 text-left" onClick={() => select(i)}><span lang="kab">{prompt.text}</span>{index === i && <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />}</Button>)}
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}