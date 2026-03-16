"use client";

import type { Row } from "@/lib/types";
import { mean, round2 } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

function pct(n: number) {
  return round2(n * 100);
}

export function KpiCards({ rows }: { rows: Row[] }) {
  const asis = rows.filter(r => r.phase === "AS_IS");
  const tobe = rows.filter(r => r.phase === "TO_BE");

  const m = (arr: Row[], key: keyof Row) => mean(arr.map(r => Number(r[key] ?? 0)));

  const kpis = [
    {
      title: "Verification rate",
      asis: m(asis, "verification_rate"),
      tobe: m(tobe, "verification_rate"),
      format: (v: number) => `${pct(v)}%`
    },
    {
      title: "Error rate",
      asis: m(asis, "error_rate"),
      tobe: m(tobe, "error_rate"),
      format: (v: number) => `${pct(v)}%`
    },
    {
      title: "Accept w/o verification",
      asis: mean(asis.map(r => r.accept_without_verification ? 1 : 0)),
      tobe: mean(tobe.map(r => r.accept_without_verification ? 1 : 0)),
      format: (v: number) => `${pct(v)}%`
    },
    {
      title: "AI prompts/day",
      asis: m(asis, "ai_prompts_per_day"),
      tobe: m(tobe, "ai_prompts_per_day"),
      format: (v: number) => `${round2(v)}`
    },
    {
      title: "Screen time (hrs)",
      asis: m(asis, "screen_time_hours"),
      tobe: m(tobe, "screen_time_hours"),
      format: (v: number) => `${round2(v)}`
    },
    {
      title: "Eye dryness score",
      asis: m(asis, "eye_dryness_score"),
      tobe: m(tobe, "eye_dryness_score"),
      format: (v: number) => `${round2(v)}`
    }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((k) => {
        const delta = k.tobe - k.asis;
        const lowerIsBetter = k.title === "Error rate" || k.title === "Accept w/o verification" || k.title.includes("dryness") || k.title.includes("AI prompts") || k.title.includes("Screen time");
        const improving = lowerIsBetter ? delta < 0 : delta > 0;

        return (
          <Card key={k.title}>
            <CardBody className="space-y-2">
              <div className="text-xs text-slate-500">{k.title}</div>
              <div className="flex items-end justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="text-slate-500">AS‑IS:</span>{" "}
                    <span className="font-semibold">{k.format(k.asis)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">TO‑BE:</span>{" "}
                    <span className="font-semibold">{k.format(k.tobe)}</span>
                  </div>
                </div>
                <div className={clsx(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium",
                  improving ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                )}>
                  {improving ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {k.format(delta)}
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
