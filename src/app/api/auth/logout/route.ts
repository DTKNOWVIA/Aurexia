import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";

async function handler(req: NextRequest) {
  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
}

export const POST = withAuth(handler);