"use client";

import Papa from "papaparse";
import type { Row } from "@/lib/types";
import { toBool, toNum } from "@/lib/utils";

export async function loadRows(): Promise<Row[]> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const res = await fetch(`${base}/data/synthetic_eastbrook_user_day.csv`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch CSV data.");
  const csv = await res.text();

  const parsed = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false
  });

  const rows: Row[] = (parsed.data || []).map((r: Record<string, any>) => ({
    user_id: String(r.user_id ?? "").trim(),
    day: toNum(r.day, 0),
    phase: String(r.phase ?? "AS_IS").trim().replace("-", "_") as any,
    age_group: String(r.age_group ?? "").trim(),

    verification_nudge: toBool(r.verification_nudge),
    interaction_limit: toBool(r.interaction_limit),
    persuasive_notifications_reduced: toBool(r.persuasive_notifications_reduced),

    ai_unavailable: toBool(r.ai_unavailable),
    ai_prompts_per_day: toNum(r.ai_prompts_per_day),
    micro_checks_per_day: toNum(r.micro_checks_per_day),
    screen_time_hours: toNum(r.screen_time_hours),
    continuous_use_minutes: toNum(r.continuous_use_minutes),
    breaks_taken: toNum(r.breaks_taken),

    verification_complexity: String(r.verification_complexity ?? "").trim(),
    verification_rate: toNum(r.verification_rate),

    reliance_type: String(r.reliance_type ?? "").trim(),
    accept_without_verification: toBool(r.accept_without_check),
    error_rate: toNum(r.error_rate),

    decision_latency_seconds: toNum(r.decision_latency_seconds),
    decision_latency_with_ai_sec:
      r.decision_latency_with_ai_sec == null || String(r.decision_latency_with_ai_sec).trim() === ""
        ? null
        : toNum(r.decision_latency_with_ai_sec),
    decision_latency_without_ai_sec: toNum(r.decision_latency_without_ai_sec),

    confidence_without_ai: toNum(r.confidence_without_ai),
    eye_dryness_score: toNum(r.eye_dryness_score),
    neck_pain_score: toNum(r.neck_pain_score),
    headaches_per_week: toNum(r.headaches_per_week),

    ai_for_social_messages: toBool(r.ai_for_social_messages),
    mood_checkins: toNum(r.mood_checkins),
    emotional_support_requests: toNum(r.emotional_support_requests),
    serious_topics_with_ai: toBool(r.serious_topics_with_ai),

    pii_shared: toBool(r.pii_shared),
    harmful_exposure_count: toNum(r.harmful_exposure_count),

    ai_reliance_baseline: toNum(r.ai_reliance_baseline),
    planning_skill: toNum(r.planning_skill),
    online_intensity: toNum(r.online_intensity)
  }));

  return rows.filter((x) => x.user_id.length > 0 && Number.isFinite(x.day));
}
