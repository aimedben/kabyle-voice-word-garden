export type PromptKind = "word" | "phrase";
export interface ReadingPrompt {
  id: string;
  kind: PromptKind;
  text: string;
  translation: string;
  source: string;
  sourceName: string;
}

function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
}

export function filterReadingPrompts(readingPrompts: ReadingPrompt[], kind: PromptKind, search: string) {
  const query = normalize(search);
  return readingPrompts.filter((prompt) => prompt.kind === kind &&
    normalize(`${prompt.text} ${prompt.translation}`).includes(query));
}
