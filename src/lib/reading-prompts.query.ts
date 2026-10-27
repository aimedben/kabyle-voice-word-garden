import { queryOptions } from "@tanstack/react-query";
import { listReadingPrompts } from "./reading-prompts.functions";

export const readingPromptsQuery = queryOptions({
  queryKey: ["public-reading-prompts"],
  queryFn: () => listReadingPrompts(),
  staleTime: 60_000,
});