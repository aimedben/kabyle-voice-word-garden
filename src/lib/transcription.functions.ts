import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Runs automatic speech-to-text on a stored recording and persists the result
 * as a machine transcription. Humans correct it afterwards; both versions are
 * kept so the correction delta stays measurable.
 */
export const transcribeRecording = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { recordingId: string }) => {
    if (!input?.recordingId || typeof input.recordingId !== "string") {
      throw new Error("recordingId is required");
    }
    return { recordingId: input.recordingId };
  })
  .handler(async ({ data, context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Transcription service is not configured");

    const { supabase, userId } = context;

    const { data: recording, error: recordingError } = await supabase
      .from("recordings")
      .select("id, storage_path, duration_seconds")
      .eq("id", data.recordingId)
      .maybeSingle();

    if (recordingError) throw new Error(recordingError.message);
    if (!recording) throw new Error("Recording not found or not accessible");

    const { data: signed, error: signedError } = await supabase.storage
      .from("recordings")
      .createSignedUrl(recording.storage_path, 300);

    if (signedError || !signed?.signedUrl) {
      throw new Error(signedError?.message ?? "Could not read the audio file");
    }

    const audioResponse = await fetch(signed.signedUrl);
    if (!audioResponse.ok) throw new Error("Could not download the audio file");
    const audioBlob = await audioResponse.blob();

    const form = new FormData();
    form.append("model", "openai/gpt-4o-transcribe");
    form.append("file", audioBlob, "recording.wav");

    const gatewayResponse = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (gatewayResponse.status === 429) {
      throw new Error("Transcription rate limit reached. Please retry in a moment.");
    }
    if (gatewayResponse.status === 402) {
      throw new Error("AI credits exhausted. Add credits to continue transcribing.");
    }
    if (!gatewayResponse.ok) {
      const detail = await gatewayResponse.text().catch(() => "");
      throw new Error(`Transcription failed (${gatewayResponse.status}). ${detail.slice(0, 200)}`);
    }

    const result = (await gatewayResponse.json()) as { text?: string };
    const text = (result.text ?? "").trim();
    if (!text) throw new Error("The model returned an empty transcription");

    const { data: saved, error: saveError } = await supabase
      .from("transcriptions")
      .insert({
        recording_id: recording.id,
        text,
        is_machine: true,
        model: "openai/gpt-4o-transcribe",
        created_by: userId,
      })
      .select("id, text, created_at")
      .single();

    if (saveError) throw new Error(saveError.message);

    return saved;
  });
