import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  AudioLines,
  BadgeCheck,
  Brain,
  Database,
  FileAudio2,
  Globe2,
  Languages,
  Mic,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import heroImage from "@/assets/hero-waveform.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { leaderboardQuery, platformStatsQuery } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KabyleVoice — Open Kabyle Speech Corpus for AI Research" },
      {
        name: "description",
        content:
          "KabyleVoice collects, validates and publishes high-quality Kabyle (Taqbaylit) speech data for ASR, speech translation, TTS and language model research.",
      },
      { property: "og:title", content: "KabyleVoice — Open Kabyle Speech Corpus for AI Research" },
      {
        property: "og:description",
        content:
          "An academic infrastructure for building the reference Kabyle speech corpus: recording, validation, transcription and dataset export.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { data: stats } = useQuery(platformStatsQuery);
  const { data: contributors } = useQuery(leaderboardQuery(6));

  const metrics = [
    { label: "Recordings collected", value: stats?.total_recordings ?? 0, icon: FileAudio2 },
    { label: "Hours of speech", value: stats?.total_hours ?? 0, icon: AudioLines },
    { label: "Validated clips", value: stats?.validated_recordings ?? 0, icon: BadgeCheck },
    { label: "Contributors", value: stats?.contributors ?? 0, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="bg-hero relative overflow-hidden">
          <div className="grid-noise pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto w-full max-w-6xl px-5 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="animate-fade-up mx-auto max-w-3xl text-center">
              <Badge
                variant="outline"
                className="mb-6 rounded-full border-primary/25 bg-primary-soft px-3 py-1 text-primary"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Open speech-data infrastructure for Taqbaylit
              </Badge>
              <h1 className="text-4xl leading-[1.06] font-extrabold text-balance md:text-6xl">
                Building the reference <span className="text-brand">Kabyle speech corpus</span> for
                artificial intelligence
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                KabyleVoice is an academic platform to collect, organise, validate and manage
                Kabyle (Taqbaylit) speech datasets — the raw material required to train speech
                recognition, speech translation, text-to-speech and large language models for a
                language that today has almost no machine-readable resources.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="rounded-xl px-6 shadow-glow">
                  <Link to="/auth" search={{ mode: "register" }}>
                    Start contributing
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-xl px-6">
                  <a href="#objectives">Read the research objectives</a>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Free for academic use · Informed consent required · Corpus documented with a
                research manifest
              </p>
            </div>

            <div className="animate-fade-up mx-auto mt-14 max-w-5xl">
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
                <img
                  src={heroImage}
                  alt="Waveform and spectrogram visualisation of Kabyle speech recordings"
                  width={1600}
                  height={1008}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px overflow-hidden px-5 py-10 md:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="px-4 py-4 text-center md:text-left">
                <m.icon className="mx-auto mb-2 h-4 w-4 text-primary md:mx-0" />
                <div className="font-display text-3xl font-extrabold tabular-nums">
                  {Number(m.value).toLocaleString()}
                </div>
                <div className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MISSION */}
        <section id="mission" className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                The project
              </p>
              <h2 className="mt-3 text-3xl font-bold text-balance md:text-4xl">
                A corpus, not a translator
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                KabyleVoice is not a translation application. It is a data platform. Every feature
                exists to raise the quality, traceability and scientific usability of one artefact:
                a Kabyle speech corpus with complete, standardised metadata.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Each clip carries its speaker profile, dialect, region, age band, recording type,
                emotional register, acoustic environment, measured quality score, automatic
                transcription and human-corrected transcription — versioned separately so model
                trainers can study annotation error itself.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Mic,
                  title: "Structured collection",
                  body: "Browser recording and file upload with a controlled metadata schema for every clip.",
                },
                {
                  icon: ShieldCheck,
                  title: "Human validation",
                  body: "Reviewers approve, reject, score quality and correct transcriptions with an audit trail.",
                },
                {
                  icon: Brain,
                  title: "AI-assisted",
                  body: "Automatic transcription seeds every clip; humans keep authority over the final text.",
                },
                {
                  icon: Database,
                  title: "Research-ready export",
                  body: "CSV, JSON, metadata packages and a manifest describing the exported slice.",
                },
              ].map((f) => (
                <Card key={f.title} className="rounded-2xl border-border shadow-card">
                  <CardContent className="p-5">
                    <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft">
                      <f.icon className="h-4 w-4 text-primary" />
                    </span>
                    <h3 className="text-sm font-semibold">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* WHY */}
        <section id="why" className="border-y border-border bg-surface">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Why it matters
              </p>
              <h2 className="mt-3 text-3xl font-bold text-balance md:text-4xl">
                Why Kabyle AI matters
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Taqbaylit is spoken by millions of people, yet it is effectively invisible to modern
                speech technology. Voice assistants, dictation, captioning and accessibility tools
                simply do not exist for it — not because the models cannot learn it, but because no
                one has assembled the data.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: Languages,
                  title: "Digital inclusion",
                  body: "Speakers should be able to dictate, search and be understood by machines in their own language, not only in French, Arabic or English.",
                },
                {
                  icon: Globe2,
                  title: "Dialectal coverage",
                  body: "Kabyle varies significantly between Tizi Ouzou, Béjaïa, Bouira and the diaspora. A usable corpus must sample that variation deliberately.",
                },
                {
                  icon: ScrollText,
                  title: "Cultural preservation",
                  body: "Oral literature, storytelling and elder speech are perishable. Recording them under research protocol preserves them for both science and community.",
                },
              ].map((c) => (
                <Card key={c.title} className="rounded-2xl border-border bg-card shadow-card">
                  <CardContent className="p-6">
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                      <c.icon className="h-5 w-5 text-accent" />
                    </span>
                    <h3 className="font-display text-base font-bold">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* OBJECTIVES */}
        <section id="objectives" className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Research programme
            </p>
            <h2 className="mt-3 text-3xl font-bold text-balance md:text-4xl">Research objectives</h2>
          </div>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {[
              {
                n: "01",
                t: "Assemble a validated Kabyle ASR corpus",
                d: "Reach a documented, human-validated corpus with balanced speaker, dialect and region coverage suitable for supervised ASR training.",
              },
              {
                n: "02",
                t: "Establish an annotation standard",
                d: "Define and enforce a reproducible metadata schema so external labs can merge, audit and cite the dataset.",
              },
              {
                n: "03",
                t: "Quantify dialectal variation",
                d: "Measure acoustic and lexical divergence between Kabyle varieties to guide dialect-aware model design.",
              },
              {
                n: "04",
                t: "Benchmark transcription quality",
                d: "Store automatic and corrected transcriptions separately to measure model error and human correction cost.",
              },
              {
                n: "05",
                t: "Enable downstream tasks",
                d: "Prepare the corpus architecture for speech translation, text-to-speech, voice assistants and fine-tuning of Kabyle language models.",
              },
              {
                n: "06",
                t: "Publish reproducible releases",
                d: "Ship versioned dataset exports with a research manifest describing filters, counts and quality distribution.",
              },
            ].map((o) => (
              <li key={o.n} className="bg-card p-6">
                <span className="font-mono text-xs font-medium text-primary">{o.n}</span>
                <h3 className="mt-2 font-display text-base font-bold">{o.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* CONTRIBUTORS */}
        <section id="contributors" className="border-y border-border bg-surface">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                  Community
                </p>
                <h2 className="mt-3 text-3xl font-bold md:text-4xl">Contributors</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  The corpus is built by native speakers. Every recording is attributed, every
                  contributor keeps a public record of their scientific contribution.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/auth" search={{ mode: "register" }}>
                  Join the corpus
                </Link>
              </Button>
            </div>

            {contributors && contributors.length > 0 ? (
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {contributors.map((c) => (
                  <Card key={c.user_id} className="rounded-2xl shadow-card">
                    <CardContent className="flex items-center gap-4 p-5">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className="bg-primary-soft text-primary">
                          {(c.display_name ?? c.username ?? "?").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {c.display_name ?? c.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Number(c.recordings).toLocaleString()} recordings ·{" "}
                          {(Number(c.seconds) / 60).toFixed(1)} min
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="mt-10 rounded-2xl border-dashed shadow-none">
                <CardContent className="p-10 text-center">
                  <Users className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No contributors have registered yet. The first recorded voices will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto w-full max-w-3xl px-5 py-20 md:py-28">
          <h2 className="text-center text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-10">
            {[
              {
                q: "Is KabyleVoice a translation app?",
                a: "No. KabyleVoice is a research data platform. Its output is a documented speech corpus with metadata and transcriptions. Translation models may later be trained on that corpus, but no translation service is offered here.",
              },
              {
                q: "Who can contribute recordings?",
                a: "Any Kabyle speaker with an account. You declare your dialect, region, age band and gender once in your profile; those values are attached to each clip so the corpus can be balanced and audited.",
              },
              {
                q: "What happens to my recordings?",
                a: "They are stored privately, reviewed by validators, and included in research exports only after validation. Exports carry the speaker identifier as a pseudonymous ID, never your email address.",
              },
              {
                q: "How is audio quality measured?",
                a: "Every clip is analysed for level, estimated signal-to-noise ratio and clipping, producing an objective score from 0 to 10. Validators can override it with a human quality judgement.",
              },
              {
                q: "How are transcriptions produced?",
                a: "An automatic speech-to-text pass generates a first transcription with a confidence indicator. A human then corrects it. Both versions are stored so the correction delta itself becomes research data.",
              },
              {
                q: "Under what licence is the corpus released?",
                a: "Exports are provided for non-commercial academic research, accompanied by a manifest recording the filters, counts and quality distribution of that specific slice.",
              },
            ].map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-24">
          <div className="bg-brand relative overflow-hidden rounded-3xl px-8 py-16 text-center shadow-lift">
            <h2 className="font-display text-3xl font-extrabold text-balance text-primary-foreground md:text-4xl">
              Your voice becomes research infrastructure
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-primary-foreground/85">
              Read a sentence, record it, and it enters a validated scientific corpus. A few minutes
              a day is enough to move Kabyle from unwritten data to trainable data.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 rounded-xl px-7">
              <Link to="/auth" search={{ mode: "register" }}>
                Create a contributor account
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
