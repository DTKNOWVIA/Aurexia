import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET(req: NextRequest, payload: any) {
  try {
    const { searchParams } = new URL(req.url);
    const commodity = searchParams.get("commodity");
    const country = searchParams.get("country");
    const stage = searchParams.get("stage");

    const assets = await prisma.asset.findMany({
      where: {
        ...(commodity && { commodity }),
        ...(country && { country }),
        ...(stage && { stage }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assets });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function POST(req: NextRequest, payload: any) {
  try {
    const {
      name,
      commodity,
      country,
      stage,
      capitalNeed,
      readinessScore,
    } = await req.json();

    if (!name || !commodity || !country) {
      return NextResponse.json(
        { error: "Name, commodity and country required" },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.create({
      data: {
        name,
        commodity,
        country,
        stage: stage || "SOURCED",
        capitalNeed,
        readinessScore,
      },
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const GET_HANDLER = withAuth(GET, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
  ROLES.INVESTMENT_MANAGER,
  ROLES.ANALYST,
  ROLES.OPERATING_PARTNER,
]);

const POST_HANDLER = withAuth(POST, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.INVESTMENT_MANAGER,
]);

export { GET_HANDLER as GET, POST_HANDLER as POST };