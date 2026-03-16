import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Dashboard running. CSV is loaded from /data/synthetic_eastbrook_user_day.csv"
  });
}
