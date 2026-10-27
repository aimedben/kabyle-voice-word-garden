import { describe, expect, test } from "bun:test";
import { filterReadingPrompts } from "./reading-prompts";

describe("Kabyle reading search", () => {
  test("finds the Kabyle word azul", () => {
    expect(filterReadingPrompts("word", "azul").map((p) => p.text)).toEqual(["azul"]);
  });
  test("finds phrases independently from words", () => {
    expect(filterReadingPrompts("phrase", "Amek i telliḍ").map((p) => p.text)).toEqual(["Amek i telliḍ ?"]);
    expect(filterReadingPrompts("word", "Amek i telliḍ")).toEqual([]);
  });
  test("supports French meanings and searches without diacritics", () => {
    expect(filterReadingPrompts("word", "merci").map((p) => p.text)).toEqual(["tanemmirt"]);
    expect(filterReadingPrompts("phrase", "tellid").map((p) => p.text)).toEqual(["Amek i telliḍ ?"]);
  });
});