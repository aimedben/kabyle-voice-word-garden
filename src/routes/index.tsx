import { createFileRoute } from "@tanstack/react-router";
import { ReadingWorkspace } from "@/components/reading-workspace";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "KabyleVoice — Lire le tamazight sans compte" },
    { name: "description", content: "Lisez des mots et phrases en kabyle, une variété de tamazight, et enregistrez votre voix sans inscription." },
    { property: "og:title", content: "KabyleVoice — Lire le tamazight sans compte" },
    { property: "og:description", content: "Des mots et phrases kabyles sourcés, accessibles sans compte." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ReadingWorkspace,
});
