"use client";

import { useEffect, useMemo, useState } from "react";
import type { Row } from "@/lib/types";
import { loadRows } from "@/lib/data";
import { Card, CardBody, CardHeader, Pill } from "@/components/ui";
import { Filters, applyFilters, type FiltersState } from "@/components/filters";
import { KpiCards } from "@/components/kpi-cards";
import { TrendLines, LatencyBars, RiskBars, WellbeingScatter } from "@/components/charts";

export function Dashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersState>({
    phase: "ALL",
    age_group: "ALL",
    reliance_type: "ALL"
  });

  useEffect(() => {
    loadRows()
      .then(setRows)
      .catch((e) => setError(String(e?.message ?? e)));
  }, []);

  const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters]);

  const counts = useMemo(() => ({
    total: filtered.length,
    users: new Set(filtered.map(r => r.user_id)).size,
    days: new Set(filtered.map(r => r.day)).size
  }), [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-600">
            Explore how AI prompt frequency relates to verification, decision latency, and well‑being (AS‑IS vs TO‑BE).
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill>{counts.total.toLocaleString()} rows</Pill>
            <Pill>{counts.users.toLocaleString()} users</Pill>
            <Pill>{counts.days.toLocaleString()} days</Pill>
          </div>
        </div>
        <Filters rows={rows} value={filters} onChange={setFilters} />
      </div>

      {error ? (
        <Card className="border-rose-200 bg-rose-50">
          <CardBody>
            <div className="text-sm font-semibold text-rose-800">Failed to load dataset</div>
            <div className="text-xs text-rose-700">{error}</div>
            <div className="mt-2 text-xs text-rose-700">
              Make sure the CSV exists at <code className="font-mono">public/data/synthetic_eastbrook_user_day.csv</code>.
            </div>
          </CardBody>
        </Card>
      ) : null}

      <KpiCards rows={filtered} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Visualization 1 — Trend (prompts/day + verification rate)"
            subtitle="Daily aggregation with AS‑IS vs TO‑BE lines"
          />
          <CardBody>
            <TrendLines rows={filtered} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Visualization 2 — Decision latency (with AI vs without AI)"
            subtitle="Phase comparison using average latency"
          />
          <CardBody>
            <LatencyBars rows={filtered} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Visualization 3 — Overreliance & risk"
            subtitle="Accept without verification, error rate, harmful exposure"
          />
          <CardBody>
            <RiskBars rows={filtered} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Visualization 4 — Well‑being vs intensity"
            subtitle="Scatter: screen time vs eye dryness (by phase)"
          />
          <CardBody>
            <WellbeingScatter rows={filtered} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
