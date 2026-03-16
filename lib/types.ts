export type Phase = "AS_IS" | "TO_BE";

export type Row = {
  user_id: string;
  day: number;
  phase: Phase;
  age_group: string;

  verification_nudge: boolean;
  interaction_limit: boolean;
  persuasive_notifications_reduced: boolean;

  ai_unavailable: boolean;
  ai_prompts_per_day: number;
  micro_checks_per_day: number;
  screen_time_hours: number;
  continuous_use_minutes: number;
  breaks_taken: number;

  verification_complexity: string;
  verification_rate: number;

  reliance_type: string;
  accept_without_verification: boolean;
  error_rate: number;

  decision_latency_seconds: number;
  decision_latency_with_ai_sec: number | null;
  decision_latency_without_ai_sec: number;

  confidence_without_ai: number;
  eye_dryness_score: number;
  neck_pain_score: number;
  headaches_per_week: number;

  ai_for_social_messages: boolean;
  mood_checkins: number;
  emotional_support_requests: number;
  serious_topics_with_ai: boolean;

  pii_shared: boolean;
  harmful_exposure_count: number;

  ai_reliance_baseline: number;
  planning_skill: number;
  online_intensity: number;
};
