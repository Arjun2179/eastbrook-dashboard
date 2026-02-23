"use client";

import type { Row } from "@/lib/types";
import { mean, round2 } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar,
  CartesianGrid,
  ScatterChart, Scatter,
} from "recharts";

export function TrendLines({ rows }: { rows: Row[] }) {
  // aggregate by day + phase
  const key = (d: number, p: string) => `${d}|${p}`;
  const map = new Map<string, Row[]>();
  for (const r of rows) {
    const k = key(r.day, r.phase);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(r);
  }
  const days = Array.from(new Set(rows.map(r => r.day))).sort((a, b) => a - b);

  const data = days.map((day) => {
    const asis = map.get(key(day, "AS_IS")) ?? [];
    const tobe = map.get(key(day, "TO_BE")) ?? [];
    return {
      day,
      asis_prompts: asis.length ? round2(mean(asis.map(r => r.ai_prompts_per_day))) : null,
      tobe_prompts: tobe.length ? round2(mean(tobe.map(r => r.ai_prompts_per_day))) : null,
      asis_verify: asis.length ? round2(mean(asis.map(r => r.verification_rate))) : null,
      tobe_verify: tobe.length ? round2(mean(tobe.map(r => r.verification_rate))) : null,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis yAxisId="left" tickFormatter={(v) => String(v)} />
        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => String(v)} />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="asis_prompts" name="AS‑IS prompts/day" strokeWidth={2} dot={false} connectNulls={false} />
        <Line yAxisId="left" type="monotone" dataKey="tobe_prompts" name="TO‑BE prompts/day" strokeWidth={2} dot={false} connectNulls={false} />
        <Line yAxisId="right" type="monotone" dataKey="asis_verify" name="AS‑IS verification rate" strokeWidth={2} dot={false} connectNulls={false} />
        <Line yAxisId="right" type="monotone" dataKey="tobe_verify" name="TO‑BE verification rate" strokeWidth={2} dot={false} connectNulls={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function LatencyBars({ rows }: { rows: Row[] }) {
  const asis = rows.filter(r => r.phase === "AS_IS");
  const tobe = rows.filter(r => r.phase === "TO_BE");

  const avg = (arr: Row[], key: keyof Row) => mean(arr.map(r => (r[key] as any) ?? 0).filter((x: any) => x != null));

  const data = [
    {
      phase: "AS‑IS",
      with_ai: round2(avg(asis, "decision_latency_with_ai_sec")),
      without_ai: round2(avg(asis, "decision_latency_without_ai_sec"))
    },
    {
      phase: "TO‑BE",
      with_ai: round2(avg(tobe, "decision_latency_with_ai_sec")),
      without_ai: round2(avg(tobe, "decision_latency_without_ai_sec"))
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="phase" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="with_ai" name="With AI (sec)" fill="#3b82f6" />
        <Bar dataKey="without_ai" name="Without AI (sec)" fill="#eab308" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RiskBars({ rows }: { rows: Row[] }) {
  const asis = rows.filter(r => r.phase === "AS_IS");
  const tobe = rows.filter(r => r.phase === "TO_BE");

  const data = [
    {
      phase: "AS‑IS",
      accept_wo_ver: round2(mean(asis.map(r => r.accept_without_verification ? 1 : 0)) * 100),
      error_rate: round2(mean(asis.map(r => r.error_rate)) * 100),
      harmful: round2(mean(asis.map(r => r.harmful_exposure_count)))
    },
    {
      phase: "TO‑BE",
      accept_wo_ver: round2(mean(tobe.map(r => r.accept_without_verification ? 1 : 0)) * 100),
      error_rate: round2(mean(tobe.map(r => r.error_rate)) * 100),
      harmful: round2(mean(tobe.map(r => r.harmful_exposure_count)))
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="phase" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="accept_wo_ver" name="Accept w/o verification (%)" fill="#3b82f6" />
        <Bar dataKey="error_rate" name="Error rate (%)" fill="#eab308" />
        <Bar dataKey="harmful" name="Harmful exposure (avg count)" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WellbeingScatter({ rows }: { rows: Row[] }) {
  const data = rows.map(r => ({
    screen_time_hours: r.screen_time_hours,
    eye_dryness_score: r.eye_dryness_score,
    phase: r.phase
  }));

  const asis = data.filter(d => d.phase === "AS_IS");
  const tobe = data.filter(d => d.phase === "TO_BE");

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="screen_time_hours" name="Screen time (hrs)" />
        <YAxis dataKey="eye_dryness_score" name="Eye dryness score" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
        <Scatter name="AS‑IS" data={asis} fill="#ef4444" fillOpacity={0.5} />
        <Scatter name="TO‑BE" data={tobe} fill="#3b82f6" fillOpacity={0.5} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
