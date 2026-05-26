import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import type { AppRole } from "@/lib/rbac";

function calculateReadinessScore(
  commercial: number,
  technical: number,
  esg: number
): number {
  const weights = {
    commercial: 0.4,
    technical: 0.35,
    esg: 0.25,
  };

  const score =
    commercial * weights.commercial +
    technical * weights.technical +
    esg * weights.esg;

  return Math.round(score);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const allowedRoles: AppRole[] = [
      ROLES.SUPER_ADMIN,
      ROLES.GP_PARTNER,
      ROLES.CIO,
      ROLES.INVESTMENT_MANAGER,
      ROLES.ANALYST,
    ];

    if (!allowedRoles.includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { commercial, technical, esg } = await req.json();

    if (commercial === undefined || technical === undefined || esg === undefined) {
      return NextResponse.json(
        { error: "Commercial, technical and ESG scores required" },
        { status: 400 }
      );
    }

    if (
      commercial < 0 || commercial > 100 ||
      technical < 0 || technical > 100 ||
      esg < 0 || esg > 100
    ) {
      return NextResponse.json(
        { error: "All scores must be between 0 and 100" },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const readinessScore = calculateReadinessScore(commercial, technical, esg);

    const updated = await prisma.asset.update({
      where: { id },
      data: { readinessScore },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "SCORE_ASSET",
        resourceType: "Asset",
        resourceId: id,
      },
    });

    return NextResponse.json({
      asset: updated,
      breakdown: {
        commercial,
        technical,
        esg,
        readinessScore,
      },
    });
  } catch (error) {
    console.error("Score error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}