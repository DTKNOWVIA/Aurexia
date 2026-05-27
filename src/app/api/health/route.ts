import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const envCheck = process.env.DATABASE_URL ? "DATABASE_URL is set" : "DATABASE_URL is MISSING";
  try {
    // Try a lightweight DB query to verify connectivity
    const res = await prisma.$queryRaw`SELECT 1 as ok`;
    return NextResponse.json({
      status: "ok",
      message: "Aurexia API is running",
      timestamp: new Date().toISOString(),
      env_check: envCheck,
      db: { reachable: true, result: res },
    });
  } catch (err: any) {
    return NextResponse.json({
      status: "ok",
      message: "Aurexia API is running",
      timestamp: new Date().toISOString(),
      env_check: envCheck,
      db: { reachable: false, error: err?.message ?? String(err) },
    }, { status: 200 });
  }
}