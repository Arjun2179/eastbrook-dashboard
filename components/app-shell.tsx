"use client";

import { BarChart3, ShieldCheck, Timer, Activity } from "lucide-react";
import clsx from "clsx";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">Eastbrook Youth AI Well‑Being</div>
              <div className="text-xs text-slate-500">AS‑IS vs TO‑BE dashboard (synthetic user‑day)</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> No login</span>
            <span className="inline-flex items-center gap-1"><Timer className="h-4 w-4" /> Filterable</span>
            <span className="inline-flex items-center gap-1"><Activity className="h-4 w-4" /> 4 key visuals</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
          Built with Next.js + TypeScript + Tailwind + Recharts • Data: synthetic_eastbrook_user_day.csv
        </div>
      </footer>
    </div>
  );
}
