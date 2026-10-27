import { describe, expect, test } from "bun:test";
import { filterReadingPrompts } from "./reading-prompts";

const prompts = [
  { id: "w1", kind: "word", text: "azul", translation: "bonjour" },
  { id: "w2", kind: "word", text: "tanemmirt", translation: "merci" },
  { id: "p1", kind: "phrase", text: "Amek i telliḍ ?", translation: "Comment vas-tu ?" },
];

describe("Kabyle reading search", () => {
  test("finds the Kabyle word azul", () => {
    expect(filterReadingPrompts(prompts, "word", "azul").map((p) => p.text)).toEqual(["azul"]);
  });
  test("finds phrases independently from words", () => {
    expect(filterReadingPrompts(prompts, "phrase", "Amek i telliḍ").map((p) => p.text)).toEqual(["Amek i telliḍ ?"]);
    expect(filterReadingPrompts(prompts, "word", "Amek i telliḍ")).toEqual([]);
  });
  test("supports French meanings and searches without diacritics", () => {
    expect(filterReadingPrompts(prompts, "word", "merci").map((p) => p.text)).toEqual(["tanemmirt"]);
    expect(filterReadingPrompts(prompts, "phrase", "tellid").map((p) => p.text)).toEqual(["Amek i telliḍ ?"]);
  });
});