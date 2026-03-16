"use client";

import { useEffect, useState } from "react";
import type { Row } from "@/lib/types";
import { loadRows } from "@/lib/data";
import { Card, CardBody } from "@/components/ui";
import { SetupChart, ConflictCognitiveChart, ConflictPhysicalChart } from "@/components/charts";

export function Dashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Filters
  const [filterAge, setFilterAge] = useState<string>("All");
  const [filterReliance, setFilterReliance] = useState<string>("All");

  useEffect(() => {
    loadRows()
      .then(setRows)
      .catch((e) => setError(String(e?.message ?? e)));
  }, []);

  const filteredRows = rows.filter((r) => {
    if (filterAge !== "All" && r.age_group !== filterAge) return false;
    if (filterReliance !== "All" && r.reliance_type !== filterReliance) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 px-4">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Current Situation Analysis</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Unmoderated AI Usage at Eastbrook (AS-IS Phase)
        </p>
      </div>

      {error ? (
        <Card className="border-rose-200 bg-rose-50">
          <CardBody>
            <div className="text-sm font-semibold text-rose-800">Failed to load dataset</div>
            <div className="text-xs text-rose-700">{error}</div>
            <div className="mt-2 text-xs text-rose-700">
              Make sure the CSV exists at <code className="font-mono">public/data/dataset_1_extracted_asis.csv</code>.
            </div>
          </CardBody>
        </Card>
      ) : null}

      {/* Dynamic Filters Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between z-10 relative">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <span className="text-sm font-semibold text-slate-700">Filter By Reliance:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {["All", "overreliance", "appropriate", "underreliance"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterReliance(level)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                  filterReliance === level 
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {level === "All" ? "All Students" : level}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <span className="text-sm font-semibold text-slate-700">Age Group:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {["All", "13-14", "15-17"].map((age) => (
              <button
                key={age}
                onClick={() => setFilterAge(age)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  filterAge === age 
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* Act 1: Setup */}
        <section className="w-full">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-slate-800">1. Setup</h2>
            <p className="text-lg text-slate-600 mt-1">Students are highly engaged with AI assistants for daily coursework.</p>
          </div>
          <Card className="shadow-2xl border-slate-200 overflow-hidden ring-1 ring-slate-900/5 transition-all hover:shadow-3xl">
            <CardBody className="p-8">
              <SetupChart rows={filteredRows} />
            </CardBody>
          </Card>
        </section>

        {/* Acts 2 & 3: Conflicts (Grid Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Act 2: Conflict 1 */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-800">2. The Cognitive Conflict</h2>
              <p className="text-rose-600 mt-1 font-medium">As usage remains high, independent fact-checking plateaus at dangerously low levels.</p>
            </div>
            <Card className="shadow-xl border-rose-100 overflow-hidden ring-1 ring-rose-900/5 bg-gradient-to-b from-white to-rose-50/30">
              <CardBody className="p-6">
                <ConflictCognitiveChart rows={filteredRows} />
              </CardBody>
            </Card>
          </section>

          {/* Act 3: Conflict 2 */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-800">3. The Physical Conflict</h2>
              <p className="text-amber-600 mt-1 font-medium">Sustained unmoderated usage triggers severe, chronic eye and neck strain.</p>
            </div>
            <Card className="shadow-xl border-amber-100 overflow-hidden ring-1 ring-amber-900/5 bg-gradient-to-b from-white to-amber-50/30">
              <CardBody className="p-6">
                <ConflictPhysicalChart rows={filteredRows} />
              </CardBody>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
