import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => { throw redirect({ to: "/read", replace: true }); },
  head: () => ({ meta: [
    { title: "Lecture sans compte — KabyleVoice" },
    { name: "description", content: "Accédez à la lecture en kabyle sans inscription." },
    { property: "og:title", content: "Lecture sans compte — KabyleVoice" },
    { property: "og:description", content: "Des mots et phrases kabyles à lire librement." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
