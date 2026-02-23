"use client";

import type { Row, Phase } from "@/lib/types";

export type FiltersState = {
  phase: "ALL" | Phase;
  age_group: "ALL" | string;
  reliance_type: "ALL" | string;
};

export function getFilterOptions(rows: Row[]) {
  const age = Array.from(new Set(rows.map(r => r.age_group).filter(Boolean))).sort();
  const rel = Array.from(new Set(rows.map(r => r.reliance_type).filter(Boolean))).sort();
  return { ageGroups: age, relianceTypes: rel };
}

export function applyFilters(rows: Row[], f: FiltersState): Row[] {
  return rows.filter((r) => {
    if (f.phase !== "ALL" && r.phase !== f.phase) return false;
    if (f.age_group !== "ALL" && r.age_group !== f.age_group) return false;
    if (f.reliance_type !== "ALL" && r.reliance_type !== f.reliance_type) return false;
    return true;
  });
}

export function Filters({
  rows,
  value,
  onChange,
}: {
  rows: Row[];
  value: FiltersState;
  onChange: (v: FiltersState) => void;
}) {
  const { ageGroups, relianceTypes } = getFilterOptions(rows);

  return (
    <div className="flex flex-wrap gap-2">
      <Select
        label="Phase"
        value={value.phase}
        options={[
          { label: "All", value: "ALL" },
          { label: "AS‑IS", value: "AS_IS" },
          { label: "TO‑BE", value: "TO_BE" },
        ]}
        onChange={(phase) => onChange({ ...value, phase: phase as any })}
      />
      <Select
        label="Age group"
        value={value.age_group}
        options={[
          { label: "All", value: "ALL" },
          ...ageGroups.map((a) => ({ label: a, value: a })),
        ]}
        onChange={(age_group) => onChange({ ...value, age_group })}
      />
      <Select
        label="Reliance type"
        value={value.reliance_type}
        options={[
          { label: "All", value: "ALL" },
          ...relianceTypes.map((t) => ({ label: t, value: t })),
        ]}
        onChange={(reliance_type) => onChange({ ...value, reliance_type })}
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs shadow-sm">
      <span className="text-slate-500">{label}</span>
      <select
        className="bg-transparent text-xs font-medium outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
