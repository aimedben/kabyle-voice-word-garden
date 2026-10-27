import { createFileRoute } from "@tanstack/react-router";
import { ReadingWorkspace } from "@/components/reading-workspace";

export const Route = createFileRoute("/read")({
  head: () => ({ meta: [
    { title: "Mots et phrases kabyles à lire — KabyleVoice" },
    { name: "description", content: "Recherchez un mot ou une phrase en kabyle et pratiquez la lecture à voix haute, sans créer de compte." },
    { property: "og:title", content: "Mots et phrases kabyles à lire — KabyleVoice" },
    { property: "og:description", content: "Lecture et enregistrement local en Taqbaylit, avec traductions françaises et sources." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ReadingWorkspace,
});
