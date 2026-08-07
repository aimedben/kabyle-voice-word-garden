import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const STATUS_LABELS = {
  pending: "Pending",
  validated: "Validated",
  rejected: "Rejected",
} as const;

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const AGE_GROUPS = [
  { value: "under_18", label: "Under 18" },
  { value: "18_29", label: "18–29" },
  { value: "30_44", label: "30–44" },
  { value: "45_59", label: "45–59" },
  { value: "60_plus", label: "60+" },
] as const;

export const RECORDING_TYPES = [
  { value: "reading", label: "Reading" },
  { value: "conversation", label: "Conversation" },
  { value: "story", label: "Story" },
  { value: "interview", label: "Interview" },
  { value: "podcast", label: "Podcast" },
] as const;

export const EMOTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "angry", label: "Angry" },
] as const;

export const NOISE_LEVELS = [
  { value: "silent", label: "Silent" },
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "street", label: "Street" },
  { value: "car", label: "Car" },
] as const;

export const platformStatsQuery = queryOptions({
  queryKey: ["platform-stats"],
  queryFn: async () => {
    const { data, error } = await supabase.rpc("platform_stats");
    if (error) throw error;
    return (
      data?.[0] ?? {
        total_recordings: 0,
        total_hours: 0,
        validated_recordings: 0,
        pending_recordings: 0,
        rejected_recordings: 0,
        contributors: 0,
        avg_quality: 0,
        total_sentences: 0,
      }
    );
  },
});

export const leaderboardQuery = (limit = 10) =>
  queryOptions({
    queryKey: ["leaderboard", limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("leaderboard", { _limit: limit });
      if (error) throw error;
      return data ?? [];
    },
  });

export const dailyGrowthQuery = (days = 30) =>
  queryOptions({
    queryKey: ["daily-growth", days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("daily_growth", { _days: days });
      if (error) throw error;
      return data ?? [];
    },
  });

export const regionsQuery = queryOptions({
  queryKey: ["regions"],
  queryFn: async () => {
    const { data, error } = await supabase.from("regions").select("*").order("name");
    if (error) throw error;
    return data ?? [];
  },
});

export const dialectsQuery = queryOptions({
  queryKey: ["dialects"],
  queryFn: async () => {
    const { data, error } = await supabase.from("dialects").select("*").order("name");
    if (error) throw error;
    return data ?? [];
  },
});

export const badgesQuery = queryOptions({
  queryKey: ["badges"],
  queryFn: async () => {
    const { data, error } = await supabase.from("badges").select("*").order("threshold");
    if (error) throw error;
    return data ?? [];
  },
});

export function formatDuration(seconds: number | null | undefined) {
  const s = Math.max(0, Math.round(Number(seconds ?? 0)));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}:${String(rest).padStart(2, "0")}`;
}

export function formatBytes(bytes: number | null | undefined) {
  const b = Number(bytes ?? 0);
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}
