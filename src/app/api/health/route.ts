import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Aurexia API is running",
    timestamp: new Date().toISOString(),
    env_check: process.env.DATABASE_URL ? "DATABASE_URL is set" : "DATABASE_URL is MISSING",
  });
}