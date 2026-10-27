export type PromptKind = "word" | "phrase";
export interface ReadingPrompt {
  id: string;
  kind: PromptKind;
  text: string;
  translation: string;
  source: string;
  sourceName: string;
}

const phrasesSource = "https://omniglot.com/language/phrases/kabyle.htm";
const dictionarySource = "http://tadjenanet.free.fr/kabylie/dictionnaire.htm";

export const readingPrompts: ReadingPrompt[] = [
  { id: "p1", kind: "phrase", text: "Amek i telliḍ ?", translation: "Comment vas-tu ?", source: phrasesSource, sourceName: "Omniglot · Kabyle" },
  { id: "p2", kind: "phrase", text: "Aqliyi bxir", translation: "Je vais bien.", source: phrasesSource, sourceName: "Omniglot · Kabyle" },
  { id: "p3", kind: "phrase", text: "Isem-ik ?", translation: "Comment t’appelles-tu ? (à un homme)", source: phrasesSource, sourceName: "Omniglot · Kabyle" },
  { id: "p4", kind: "phrase", text: "Isem-im ?", translation: "Comment t’appelles-tu ? (à une femme)", source: phrasesSource, sourceName: "Omniglot · Kabyle" },
  { id: "p5", kind: "phrase", text: "Ar azekka", translation: "À demain.", source: dictionarySource, sourceName: "Dictionnaire kabyle" },
  { id: "w1", kind: "word", text: "azul", translation: "bonjour", source: "https://lmed.ovh/", sourceName: "Lmed · Apprendre le kabyle" },
  { id: "w2", kind: "word", text: "tanemmirt", translation: "merci", source: "https://lmed.ovh/", sourceName: "Lmed · Apprendre le kabyle" },
  { id: "w3", kind: "word", text: "ih", translation: "oui", source: phrasesSource, sourceName: "Omniglot · Kabyle" },
  { id: "w4", kind: "word", text: "xaṭi", translation: "non", source: phrasesSource, sourceName: "Omniglot · Kabyle" },
  { id: "w5", kind: "word", text: "amek", translation: "comment", source: phrasesSource, sourceName: "Omniglot · Kabyle" },
  { id: "w6", kind: "word", text: "tayri", translation: "amour", source: dictionarySource, sourceName: "Dictionnaire kabyle" },
  { id: "w7", kind: "word", text: "izimer", translation: "agneau", source: dictionarySource, sourceName: "Dictionnaire kabyle" },
  { id: "w8", kind: "word", text: "tizizwit", translation: "abeille", source: dictionarySource, sourceName: "Dictionnaire kabyle" },
  { id: "w9", kind: "word", text: "ddu", translation: "aller", source: dictionarySource, sourceName: "Dictionnaire kabyle" },
];

function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
}

export function filterReadingPrompts(kind: PromptKind, search: string) {
  const query = normalize(search);
  return readingPrompts.filter((prompt) => prompt.kind === kind &&
    normalize(`${prompt.text} ${prompt.translation}`).includes(query));
}

export const READING_REQUIRES_ACCOUNT = false;