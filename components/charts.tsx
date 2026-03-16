"use client";

import type { Row } from "@/lib/types";
import { mean, round2 } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  AreaChart, Area, ComposedChart
} from "recharts";

// Helper to aggregate data by day for the AS-IS storytelling
function getDailyAggregates(rows: Row[]) {
  const days = Array.from(new Set(rows.map(r => r.day))).sort((a, b) => a - b);
  return days.map(day => {
    const dayRows = rows.filter(r => r.day === day);
    return {
      day: `Day ${day}`,
      prompts: dayRows.length ? round2(mean(dayRows.map(r => r.ai_prompts_per_day))) : null,
      verification: dayRows.length ? round2(mean(dayRows.map(r => r.verification_rate)) * 100) : null,
      eye_dryness: dayRows.length ? round2(mean(dayRows.map(r => r.eye_dryness_score))) : null,
      neck_pain: dayRows.length ? round2(mean(dayRows.map(r => r.neck_pain_score))) : null,
    };
  });
}

// SLU High Data-To-Ink Ratio Global Settings
const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fill: '#6b7280', fontSize: 12 }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-slate-200 shadow-xl rounded-xl">
        <p className="font-semibold text-slate-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function SetupChart({ rows }: { rows: Row[] }) {
  const data = getDailyAggregates(rows);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        {/* NO GRIDLINES for high data-to-ink ratio */}
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: "4 4" }} />
        <Area 
          type="monotone" 
          dataKey="prompts" 
          name="Avg Daily Prompts" 
          stroke="#3b82f6" 
          fillOpacity={1}
          fill="url(#colorPrompts)"
          strokeWidth={4} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ConflictCognitiveChart({ rows }: { rows: Row[] }) {
  const data = getDailyAggregates(rows);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVerif" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: "4 4" }} />
        <Area 
          type="monotone" 
          dataKey="verification" 
          name="Verification Rate (%)" 
          stroke="#ef4444" 
          fillOpacity={1}
          fill="url(#colorVerif)"
          strokeWidth={4} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ConflictPhysicalChart({ rows }: { rows: Row[] }) {
  const data = getDailyAggregates(rows);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorNeck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} domain={[0, 10]} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: "4 4" }} />
        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
        
        {/* Mixed Area and Line for advanced visualization */}
        <Area 
          type="monotone" 
          dataKey="neck_pain" 
          name="Neck Pain (Avg)" 
          stroke="#f43f5e" 
          fill="url(#colorNeck)"
          strokeWidth={3} 
          dot={{ r: 4, fill: '#fff', stroke: '#f43f5e', strokeWidth: 2 }}
          activeDot={{ r: 7 }}
        />
        <Line 
          type="monotone" 
          dataKey="eye_dryness" 
          name="Eye Dryness (Avg)" 
          stroke="#f59e0b" 
          strokeWidth={4} 
          dot={{ r: 4, fill: '#fff', stroke: '#f59e0b', strokeWidth: 2 }}
          activeDot={{ r: 7 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
