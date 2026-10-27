import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { ReadingPrompt } from "./reading-prompts";

export const listReadingPrompts = createServerFn({ method: "GET" }).handler(async (): Promise<ReadingPrompt[]> => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("La collection est momentanément indisponible.");
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client.from("reading_prompts")
    .select("id, kind, text, translation, source, source_name")
    .eq("is_active", true).order("position");
  if (error) throw new Error("Impossible de charger la collection. Réessayez dans un instant.");
  return (data ?? []).flatMap((row) => {
    if (row.kind !== "word" && row.kind !== "phrase") return [];
    return [{ id: row.id, kind: row.kind, text: row.text, translation: row.translation, source: row.source, sourceName: row.source_name }];
  });
});